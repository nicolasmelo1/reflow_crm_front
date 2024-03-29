import React, { useState , useEffect, memo } from 'react'
import { EventEmitter, KeyboardAvoidingView } from 'react-native'
import { renderToString } from 'react-dom/server'
import Content from '../Content'
import { TextBlockOptions } from '../Toolbar/BlockOptions'
import { TextContentOptions } from '../Toolbar/ContentOptions'
import { strings } from '../../../utils/constants'
import delay from  '../../../utils/delay'
import {
    getCaretCoordinatesWeb,
    caretIsInHighestOrLowestPositionWeb,
    getSelectionSelectCursorPositionWeb,
    setCaretPositionWeb
} from '../utils'
import { 
    BlockText,
    BlockTextPlaceholderContainer,
    BlockTextPlaceholderText
} from '../../../styles/RichText'


const makeDelay = delay(1000)

/**
 * This is the Text component, one of the most important blocks of the RichText, it is the main block of our richText.
 * The rich text itself starts with a text block and every new block is automatically a text block. When the user want to
 * add a new block type what we actually do is convert this block to a a block of another type.
 * 
 * This is definetly one of the biggest components of the hole application but don't be scared, it just need many logic to work
 * but it's not that difficult once you get it.
 * 
 * Differently from other richText libraries what we wanted to do was to make the rich text active and not passive. What this
 * means in other words is that the data actually defines what is rendered, so whenever we type a new word we update the state with
 * this new word and then we use this data to rerender the block again. Most rich texts use a different metodology where they prevent
 * to the maximum a text to be rerendered. We wanted to follow this path because first we thought it would be easier to understand
 * and second is that it is what we knew how to do.
 * 
 * Most of the logic here resides on a simple ref: `caretPositionRef` this is the object that holds the start and end position of the 
 * caret and this is SUPER important for everything inside here to work. By knowing the start and end positions of a caret on the rich text
 * we can know where a new text should be inserted, if a text was deleted where it was deleted. All of the contexts affected when the 
 * state change (to bold, to italic and so on). And etc. Understanding this you basically understand 90% of the text block.
 * 
 * {... all of the props defined in the Block component}
 * @param {Object} toolbarProps - Holds all of the obligatory props needed for the toolbar
 * @param {Function} addToolbar - The addToolbar function from the Block component (not the page component)
 * @param {File} imageFile - If the user made a ctrl+c image file and ctrl+v on a text block, this will hold the actual file of the image
 * @param {Array<String>} customBlockOptions - Holds all of the options that needs to be reseted when a block changes types or is duplicated.
 * @param {Function} onPasteImageInText - Function that handles when the user pastes an image file on a Text block type.
 * @param {Function} openBlockSelection - Opens the selection of possible blocks that a user can select. Used when the user press '/' before
 * adding any content to the text block.
 * @param {Function} createNewContent - Creates a new content inside a block, a content is an inline content. A text can contain multiple contents
 * @param {Function} createNewBlock - As the name suggests, used for creating a new Block
 */
const Text = (props) => {
    const stateOfSelectionData = {
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isCode: false,
        isCustom: false,
        customValue: null,
        markerColor: '',
        textColor: '',
        textSize: 12
    }

    const isInCompositionRef = React.useRef(false)
    const isMountedRef = React.useRef(false)
    const wasKeyDownPressedRef = React.useRef(false)
    const isFocusingRef = React.useRef(false)
    const isSpecialKeydownPressed = React.useRef(false)
    const keyDownPressedRef = React.useRef(null)
    const inputRef = React.useRef(null)
    const activeBlockRef = React.useRef(null)
    const caretPositionRef = React.useRef({
        start: 0,
        end: 0
    })
    const whereCaretPositionShouldGoAfterUpdateRef = React.useRef(process.env['APP'] === 'web' ? {
        contentIndex: null,
        positionInContent: null
    } : {
        start: 0,
        end: 0
    })
    const isWaitingForCustomInput = React.useRef(false)
    const isWaitingForBlockSelection = React.useRef(false)
    const customInputCaretPosition = React.useRef(caretPositionRef)
    const [block, setBlock] = useState(JSON.parse(JSON.stringify(props.block)))
    const [innerHtml, setInnerHtml] = useState('')
    const [isToolbarModalOpen, setToolbarIsModalOpen] = useState(false)
    const [stateOfSelection, setStateOfSelection] = useState(stateOfSelectionData)

    // ------------------------------------------------------------------------------------------
    /**
     * This passes the state from the block state to the block props.
     */
    const blockStateToPropsBlock = () => {
        const copiedBlock = JSON.parse(JSON.stringify(block))
        const keys = Object.keys(props.block)
        for (let i=0; i<keys.length; i++) {
            props.block[keys[i]] = copiedBlock[keys[i]]
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * THis is a function for adding the toolbar in the root of the page.
     * With this simple function we can maintain a simple API for the components to follow and also allow
     * complex layouts to be created.
     * 
     * So let's start. HOW THE F•C* does this work?
     * - First things first: On the parent component we do not keep the state but instead we keep everything inside
     * of a ref. This way we can prevent rerendering stuff and just rerender when needed.
     * - Second: all you need is to add this function on a useEffect hook or a componentDidUpdate, this way after every
     * rerender of your component we can keep track on what is changing and force the rerender of the hole page tree.
     * - Third but not least we save all of the data needed to render a Toolbar. This means we need the following parameters:
     *  - `blockUUID` - The uuid of the current block
     *  - `contentOptionComponent` - The React component of the content options we want to render, these are options of each content
     * of the block. They are usually the same, but sometimes you are not dealing with text, so you want to prevent the user
     * from selecting bold and so on.
     *  - `blockOptionComponent` - The React component of the BLOCK options we want to render, these are options for the specific
     * block you have selected.
     *  - `contentOptionProps` - The props that will go to `contentOptionComponent`
     *  - `blockOptionProps` - The props that will go to `blockOptionComponent`
     * 
     * HOW TO USE THIS:
     * You need to run this function ONLY inside of a useEffect of componentDidUpdate. MAKE SURE YOU ARE LISTENING TO THE
     * the state changes that you need. (for example, here we are listening for changes in props and stateOfSelection, every other state
     * change is irrelevant. When any of this states changes we want the toolbar to update accordingly.)
     */
    const addToolbar = () => {
        if (props.addToolbar) {
            props.toolbarProps.contentOptionComponent = TextContentOptions
            props.toolbarProps.blockOptionComponent = TextBlockOptions
            props.toolbarProps.contentOptionProps = {
                onOpenModal: setToolbarIsModalOpen,
                onChangeSelectionState: onChangeSelectionState,
                stateOfSelection: stateOfSelection
            }
            props.toolbarProps.blockOptionProps = {
                alignmentTypeId: block.text_option?.alignment_type,
                onChangeAlignmentType: onChangeAlignmentType,
                types: props.types
            }
            props.addToolbar(
                props.toolbarProps
            )
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Gets alignment type name by it's id, we need this because we only have the id of the alignmentType but not
     * 
     * @param {BigInteger} id - The id of the aligment type that you want to retrieve the name
     * 
     * @returns {String} - The name of the alignment_type id that you send or an empty string if it does not exist.
     */
    const getAlignmentTypeNameById = (id) => {
        for (let i = 0; i<props.types.rich_text.alignment_type.length; i++) {
            if (props.types.rich_text.alignment_type[i].id === id) {
                return props.types.rich_text.alignment_type[i].name
            }
        } 
        return ''
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Check if the position of the caret is on a custom content, if it is we need to select the hole content so the
     * user cannot edit the middle of it
     */
    const checkIfCaretPositionIsCustomFixAndSetCaretPosition = () => {
        const selectedContents = getSelectedContents()
        if (selectedContents.length > 0 && props.isEditable) {
            const firstContentInSelection = selectedContents[0]
            const lastContentInSelection = selectedContents[selectedContents.length-1]
            if (lastContentInSelection.content.is_custom || firstContentInSelection.content.is_custom) {
                if (lastContentInSelection.content.is_custom && lastContentInSelection.endIndexToSelectTextInContent !== lastContentInSelection.content.length) {
                    caretPositionRef.current.end = caretPositionRef.current.end + (lastContentInSelection.content.text.length - lastContentInSelection.endIndexToSelectTextInContent)
                }
                if (firstContentInSelection.content.is_custom && firstContentInSelection.startIndexToSelectTextInContent !== 0) {
                    caretPositionRef.current.start = caretPositionRef.current.start - firstContentInSelection.startIndexToSelectTextInContent
                }
                if (process.env['APP'] === 'web') {
                    setCaretPositionWeb(
                        inputRef.current,
                        props.arrowNavigation,
                        isFocusingRef.current,
                        firstContentInSelection.contentIndex, 
                        firstContentInSelection.content.is_custom ? 0: firstContentInSelection.startIndexToSelectTextInContent, 
                        lastContentInSelection.contentIndex, 
                        lastContentInSelection.content.is_custom ? lastContentInSelection.content.text.length : lastContentInSelection.endIndexToSelectTextInContent
                    ) 
                }
            }
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * On the browser, when we update the state, the caret jumps (it means it disappear) so the user needs 
     * to click the element again to make a second edit and so on. It obviously becomes kind of annoying for the user
     * experience.
     * 
     * - First we need to see if the element is defined and if the element is the active element of the document. 
     * (without this all the other text blocks of the document would be focused)
     * - Then we check if the `whereCaretPositionShouldGoAfterUpdateRef` was defined and is not null, if it is we need to go to this position
     * otherwise the caret shoud go to the position of the `caretPositionRef` (this is used when we focus the input, onEnter and onRemoveCurrent and onRemoveAfter)
     * - Then we update whereCaretPositionShouldGoAfterUpdateRef to null, so the caret should not go to any new position except the position it is currently in.
     * - Also update the caretPositionRef to the current caret position.
     * - Then we check if it is a custom element, if it is we need to select the hole content
     * - Then we check the state of this element (is it bold, is it italic) and then we update the options of the text.
     * 
     * @param {String} activeBlock - THe current active block in the page.
     */
    const setCaretPositionInInput = (activeBlock) => {
        if (activeBlock === block.uuid && !isWaitingForCustomInput.current) {
            if (process.env['APP'] === 'web') {
                if (whereCaretPositionShouldGoAfterUpdateRef.current.contentIndex !== null && whereCaretPositionShouldGoAfterUpdateRef.current.positionInContent !== null) {
                    setCaretPositionWeb(
                        inputRef.current,
                        props.arrowNavigation,
                        isFocusingRef.current,
                        whereCaretPositionShouldGoAfterUpdateRef.current.contentIndex, 
                        whereCaretPositionShouldGoAfterUpdateRef.current.positionInContent
                    )
                } else {
                    if (caretPositionRef.current.start === null && caretPositionRef.current.end === null) {
                        caretPositionRef.current = getSelectionSelectCursorPositionWeb(inputRef.current)
                    }
                    const selectedContents = getSelectedContents()
                    if (selectedContents[0]) {
                        setCaretPositionWeb(
                            inputRef.current,
                            props.arrowNavigation,
                            isFocusingRef.current,
                            selectedContents[0].contentIndex, 
                            selectedContents[0].startIndexToSelectTextInContent,              
                            selectedContents[selectedContents.length-1].contentIndex,
                            selectedContents[selectedContents.length-1].endIndexToSelectTextInContent
                        )
                    } else {
                        const contents = block.rich_text_block_contents
                        setCaretPositionWeb(
                            inputRef.current,
                            props.arrowNavigation,
                            isFocusingRef.current,
                            contents.length - 1, 
                            contents[contents.length - 1].text.substring(contents[contents.length - 1].text.length-1, contents[contents.length - 1].text.length) === '\n' ? contents[contents.length - 1].text.length-1 : contents[contents.length - 1].text.length
                        )
                    }
                } 
                isFocusingRef.current = false
                whereCaretPositionShouldGoAfterUpdateRef.current = {
                    contentIndex: null,
                    positionInContent: null
                }
                caretPositionRef.current = getSelectionSelectCursorPositionWeb(inputRef.current)
                
                checkIfCaretPositionIsCustomFixAndSetCaretPosition()
                checkStateOfSelectedElementAndUpdateState()
            }
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Is explained well in `caretIsInHighestOrLowestPositionWeb` function. Read the docs there to understand
     * how we know that the caret is on the top of the content and how we know it is on the bottom.
     * 
     * Since this function holds many business logic we decided to keep it inside of the component.
     * 
     * What this does is simple: when the arrow is up and the caret is in the highest position of the block
     * we need to focus on the previous block. To get the previous `text` block type index we use the `getPreviousBlockIndex`
     * function to retrieve the index of the previous `text` block. A similar approach is applied when the user press down and the caret 
     * is in the lowest position. What we do is check if the caret is in the lowestPosition of the block and if it is we get the next
     * block index that we need to focus.
     * 
     * We can override both functions when going up or down with `handleArrowNavigationNextBlockIndex` and `handleArrowNavigationPreviousBlockIndex`
     * function props. For example, transversing tables should be different than transversing a normal text, so this could be use to override this
     * functionality without losing the ability to transverse blocks.
     * 
     * Be aware that before going to the next block we update the page state with setArrowNavigation signaling the X position of the caret.
     */
    const handleArrowNavigationWeb = () => {
        const contextBlocks = props.getContextBlocks()

        // ------------------------------------------------------------------------------------------
        const getNextBlockIndex = (isDownOrRight) => {
            let nextTextBlockIndex = -1
            if (props.handleArrowNavigationNextBlockIndex) {
                nextTextBlockIndex = props.handleArrowNavigationNextBlockIndex(block.uuid, isDownOrRight)
            } else {
                const indexOfCurrentBlock = contextBlocks.findIndex(contextBlock => contextBlock.uuid === block.uuid)
                for (let i = 0; i < contextBlocks.length; i++) {
                    if (contextBlocks[i].block_type === props.getBlockTypeIdByName('text') && i > indexOfCurrentBlock) {
                        nextTextBlockIndex = i
                        break
                    }
                }
            }
            return nextTextBlockIndex
        } 
        // ------------------------------------------------------------------------------------------
        const getPreviousBlockIndex = (isUpOrLeft) => {
            let previousTextBlockIndex = -1
            if (props.handleArrowNavigationPreviousBlockIndex) {
                previousTextBlockIndex = props.handleArrowNavigationPreviousBlockIndex(block.uuid, isUpOrLeft)
            } else {
                const indexOfCurrentBlock = contextBlocks.findIndex(contextBlock => contextBlock.uuid === block.uuid)
                for (let i = indexOfCurrentBlock; i >= 0; i--) {
                    if (contextBlocks[i].block_type === props.getBlockTypeIdByName('text') && i < indexOfCurrentBlock) {
                        previousTextBlockIndex = i
                        break
                    }
                }
            }
            return previousTextBlockIndex
        }
        // ------------------------------------------------------------------------------------------
        if (typeof(keyDownPressedRef.current) === 'string' && keyDownPressedRef.current.toLowerCase().includes('arrow')){
            const caretIndexPosition = getSelectionSelectCursorPositionWeb(inputRef.current)
            const text = inputRef.current.innerText.substring(inputRef.current.innerText.length-1, inputRef.current.innerText.length) === '\n' ? 
                inputRef.current.innerText.substring(0, inputRef.current.innerText.length-1) : inputRef.current.innerText
            const caretPosition = getCaretCoordinatesWeb()            

            blockStateToPropsBlock()
            const isFirstContent = block.rich_text_block_contents.length === 1 && (block.rich_text_block_contents[0].text === '' || block.rich_text_block_contents[0].text === '\n')
            if (keyDownPressedRef.current === 'ArrowDown' && (caretIsInHighestOrLowestPositionWeb(inputRef.current).isLowest || isFirstContent)) {    
                props.setArrowNavigation({
                    focusX: caretPosition.x,
                    isDownPressed: true
                })

                const nextTextBlockIndex = getNextBlockIndex({isDownPressed: true})
                if (nextTextBlockIndex !== -1) {
                    activeBlockRef.current = contextBlocks[nextTextBlockIndex].uuid
                    props.updateBlocks(contextBlocks[nextTextBlockIndex].uuid)
                }
            } else if (keyDownPressedRef.current === 'ArrowUp' && (caretIsInHighestOrLowestPositionWeb(inputRef.current).isHighest || isFirstContent)) {
                props.setArrowNavigation({
                    focusX: caretPosition.x,
                    isUpPressed: true
                })
                const previousTextBlockIndex = getPreviousBlockIndex({isUpPressed: true})
                if (previousTextBlockIndex !== -1) {
                    activeBlockRef.current = contextBlocks[previousTextBlockIndex].uuid
                    props.updateBlocks(contextBlocks[previousTextBlockIndex].uuid)
                }
            } else if (keyDownPressedRef.current === 'ArrowRight' && ((caretIsInHighestOrLowestPositionWeb(inputRef.current).isLowest && caretIndexPosition.start >= text.length) || isFirstContent)) {
                props.setArrowNavigation({
                    isRightPressed: true
                })
                const nextTextBlockIndex = getNextBlockIndex({isRightPressed: true})
                if (nextTextBlockIndex !== -1) {
                    activeBlockRef.current = contextBlocks[nextTextBlockIndex].uuid
                    props.updateBlocks(contextBlocks[nextTextBlockIndex].uuid)
                }
            } else if (keyDownPressedRef.current === 'ArrowLeft' && ((caretIsInHighestOrLowestPositionWeb(inputRef.current).isHighest && caretIndexPosition.start === 0) || isFirstContent)) {
                props.setArrowNavigation({
                    focusX: caretPosition.x,
                    isLeftPressed: true
                })
                const previousTextBlockIndex = getPreviousBlockIndex({isLeftPressed: true})
                if (previousTextBlockIndex !== -1) {
                    activeBlockRef.current = contextBlocks[previousTextBlockIndex].uuid
                    props.updateBlocks(contextBlocks[previousTextBlockIndex].uuid)
                }
            }
            keyDownPressedRef.current = null
        }
    }
    // ------------------------------------------------------------------------------------------    
    /**
     * WORKS ONLY ON WEB 
     * 
     * Okay, so this might seems kinda tricky to follow along if you do not have a Mac but anyway, this can help you have a better understanding:
     * https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event
     * 
     * What happens is that: on Mac when you type the following word: não 
     * it goes like this per key stroke:
     * 1. n
     * 2. n˜
     * 3. nã
     * 4. não
     * 
     * See that in step 2 the accent appears from a moment of time waiting for the next word and on step 3 the `˜` disappears and `ã` shows in its place? 
     * This is what the compositionStart and compositionEnd stands for. When the user is trying to write a new letter with an accent, when the user writes an accent
     * like `˜` the `onCompositionStart` event is fired, waiting for the next input. If the user clicks outside, move the cursor with the arrows, or write a character
     * then `onCompositionEnd` is fired. So what do we do is: 
     * 
     * When compositionStart is fired we update a ref to signal that a composition is taking place, with this ref we prevent the onInput event from being fired and updating 
     * the state.
     * So with this restriction, just when the composition ends, we update the text with the new insertedText. And then we also update the ref to signal that the 
     * composition has just ended and is not taking place anymore.
     * 
     * @param {String} insertedText - The text that was inserted with the accent.
     */
    const onCompositionEnd = (insertedText) => {
        isInCompositionRef.current = false
        onInput(inputRef.current.innerText, 'inputText', insertedText)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Retrieves the selected contents from the selection.
     * Suppose you have the phrase: "ILoveCats" in which "I" is a content in the array,
     * "Love" is another content on the array and "Cats" is another content in the contents array.
     * 
     * If we select the following range "ILo|veCa|ts" (the "|" represents the selection start and finish)
     * since our contents consists of ["I", "Love", "Cats"] the contents that we will update are "Love" and "Cats"
     * so index 1 and 2 in the array.
     * 
     * This is what this does, gets the contents inside of the selection that was or will be updated, this way
     * we can update them accordingly.
     * 
     * @returns {Array<Object>} - Each object in the array will have the following structure:
     *  {   
     *      startIndexToSelectTextInContent: {BigInteger} - When the selection start in the text inside of this content,
     *      endIndexToSelectTextInContent: {BigInteger} - When the selection ends in the text inside of this content,
     *      contentIndex: {BigInteger} - The index of the content inside of `rich_text_block_contents`, 
     *      content: {Object} - The content of the object.
     *  }
     */
    const getSelectedContents = () => {
        let stackedNumberOfWords = 0
        let selectedContentsArray = []
        const contents = block.rich_text_block_contents
        for (let contentIndex=0; contentIndex < contents.length; contentIndex++) {
            const lengthOfContent = contents[contentIndex].text.length
            const stackedNumberOfWordsWithLengthOfContent = stackedNumberOfWords + lengthOfContent
            
            // conditionals to check, first check if user selected any number of carets or just set the caret to a certain position
            // second check if the content is inside of range. And Third checks if content is inside of selection if the user hasn't selected a range.
            // (IT IS NOT A SELECTION RANGE, here the user has just set a caret position)
            const isRangeSelection = caretPositionRef.current.start !== caretPositionRef.current.end
            const isContentInSelectionRange = caretPositionRef.current.start < stackedNumberOfWordsWithLengthOfContent && stackedNumberOfWords <= caretPositionRef.current.end
            const isContentInSelection = caretPositionRef.current.start <= stackedNumberOfWordsWithLengthOfContent
            
            // Set start and end indexes inside of each content
            const startIndexToSelectTextInContent = (caretPositionRef.current.start - stackedNumberOfWords < 0) ? 0 : caretPositionRef.current.start - stackedNumberOfWords
            const endIndexToSelectTextInContent = (caretPositionRef.current.end - stackedNumberOfWords < lengthOfContent) ? caretPositionRef.current.end - stackedNumberOfWords : lengthOfContent

            // is a Range selection
            if (isRangeSelection && isContentInSelectionRange) {
                // always consider custom contents as hole
                selectedContentsArray.push({
                    startIndexToSelectTextInContent: contents[contentIndex].is_custom ? 0 : startIndexToSelectTextInContent,
                    endIndexToSelectTextInContent: contents[contentIndex].is_custom ? contents[contentIndex].text.length : endIndexToSelectTextInContent,
                    contentIndex: contentIndex, 
                    content: ![undefined, null].includes(contents[contentIndex]) ? JSON.parse(JSON.stringify(contents[contentIndex])) : props.createNewContent({order: 0})
                })
            // The user just set the caret to a certain position without selecting a range
            } else if (!isRangeSelection && isContentInSelection) {
                // always consider custom contents as hole
                selectedContentsArray.push({
                    startIndexToSelectTextInContent: contents[contentIndex].is_custom ? 0 : startIndexToSelectTextInContent,
                    endIndexToSelectTextInContent: contents[contentIndex].is_custom ? contents[contentIndex].text.length : endIndexToSelectTextInContent,
                    contentIndex: contentIndex, 
                    content: ![undefined, null].includes(contents[contentIndex]) ? JSON.parse(JSON.stringify(contents[contentIndex])) : props.createNewContent({order: 0})
                })
            }

            if (stackedNumberOfWordsWithLengthOfContent >= caretPositionRef.current.end) {
                break
            }
            stackedNumberOfWords = stackedNumberOfWordsWithLengthOfContent
        }
        return selectedContentsArray
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Deletes the content when the text inside of the content is a '' (empty string).
     * Otherwise we keep the content.
     * 
     * This changes the prop directly so no return is expected from this function.
     */
    const deleteEmptyContents = () => {
        let contentsToConsider = []
        let removedCustomContents = []
        for (let i=0; i < block.rich_text_block_contents.length; i++) {
            if (block.rich_text_block_contents[i].text !== '') {
                contentsToConsider.push(block.rich_text_block_contents[i])
            } else if (block.rich_text_block_contents[i].is_custom) {
                removedCustomContents.push(JSON.parse(JSON.stringify(block.rich_text_block_contents[i])))
            }
        }

        block.rich_text_block_contents = contentsToConsider

        if (props.onRemoveUnmanagedContent) {
            props.onRemoveUnmanagedContent(removedCustomContents)
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Suppose we have the following contents ["I", "Love", "Cats"] and the type of them are like
     * [not-bold, bold, not-bold] when we turn "Cats" content to bold what we need to do is merge index 1 and index 2
     * together so we will end with the following contents ["I", "LoveCats"].
     * 
     * We do this because as then we have less contents to work with after this merge simplifying the calculations.
     * 
     * In the example above if we changed "Love" to `not-bold` we would end up with a single content like ["ILoveCats"]
     * because on both sides they would be exactly the same so we can merge everything together.
     * 
     * Obviously equal types are not only bold, they can be italic, a code, a underline, a text color and so on.
     * In this case what we do is to verify all of the types (exception for ids, ordering and text) and merge the texts together
     * creating one single content with merged texts.
     * 
     * @param {Array<Object>} contentsArray - Recieves an array of contents that will be merged together in a single content.
     * 
     * @returns {Array<Object>} - Returns a contents array with merged contents
     */
    const mergeEqualContentsSideBySide = (contentsArray) => {
        let newContents = []
        let contents = [...contentsArray]

        // if two contents that are side by side are equal, create a new content that merge the content text
        while (contents.length > 0) {
            if (contents[1] !== undefined &&
                !contents[0].is_custom && !contents[1].is_custom &&
                contents[0].link === contents[1].link &&
                contents[0].is_bold === contents[1].is_bold && 
                contents[0].is_italic === contents[1].is_italic &&
                contents[0].is_code === contents[1].is_code && 
                contents[0].is_underline === contents[1].is_underline && 
                contents[0].marker_color === contents[1].marker_color &&
                contents[0].text_size === contents[1].text_size &&
                contents[0].text_color === contents[1].text_color) {
                newContents.push(props.createNewContent({
                    isBold: contents[0].is_bold, 
                    isCode: contents[0].is_code, 
                    isItalic: contents[0].is_italic, 
                    isUnderline: contents[0].is_underline, 
                    latexEquation: contents[0].latex_equation, 
                    link: contents[0].link, 
                    markerColor: contents[0].marker_color, 
                    order: newContents.length+1, 
                    textColor: contents[0].text_color,
                    textSize: contents[0].text_size,
                    text: contents[0].text + contents[1].text
                }))
                contents.splice(0, 2)
            } else {
                newContents.push({...contents[0], order: newContents.length+1})
                contents.splice(0, 1)
            }
        }
        // if the block has no contents, insert a new empty content.
        if (newContents.length === 0) newContents.push(props.createNewContent({order: 0}))
        // if the block has a single empty content, reset the state of it
        if (newContents.length === 1 && newContents[0].text === '') newContents[0] = props.createNewContent({order: 0, text: ''})
        return newContents
    }
    // ------------------------------------------------------------------------------------------
    /**
     * The name of this function is mostly self explanatory but anyway
     * 
     * When we make changes to the state of the RichText component the caret disappears. So what we need to do
     * is set this caret again in it's position. To do this we use this function alongside with `setCaretPositionInInput`
     * 
     * This function just gets the position where the caret should go, this position are both: The content where the
     * caret should go and the position inside of the content text where the caret should go.
     * 
     *   |--------------|
     *  |  FOR MOBILE  |
     * |--------------|
     * - On mobile no such thing is needed we just update the refs of the caretPositionRef to maintain the right position
     * of the caret. This function does not have the right name for mobile. On mobile what we do is just update the refs.
     * so when the user types another word the `caretPositionRef.current` is in the right position.
     *
     * We do this because we can't prevent any event from firing in mobile. So if the user is typing and the state is still being
     * updated `onSelectText` will not update the caretPositionRef. When the code reaches here it means we have already
     * updated the state, or is at least close to fire the update. So we update the refs for the next input.
     *       
     * If we did not made this what would happen is this: 
     * - If we are in position {start: 0, end:0} and tries to insert an letter 'A' in the input
     * - While inserting the caretPositionRef would be { start: 1, end: 1} because it would fire `onSelectChange` while firing `onChangeText`
     *
     * The same happens on the browser if we used onKeyUp event. onKeyUp fires the onSelect because the browser understands that
     * after adding 'A' the caret will move from '|' to 'A|' (the "|" is the caret). So if A has been inserted now the selection changed from
     * position 0 to position 1. That's why we use onInput instead. onInput fires BEFORE the 'A' is inserted in the input, so, before the onSelect event.
     *
     * on Mobile no such event as onInput exists, that's why we need to use this little hack for.
     *
     * On web it works differently. 
     * 
     * @param {String} insertedText - The inserted text in the input.
     */
    const updateWhereCaretPositionShouldGo = (insertedText) => {
        // Sets the caret position, the caret position to go is the caretPosition start + insertedText length
        // then we need to make this in a for loop so we count each content text length and check if the content is between
        // the caret position to go.
        let stackedNumberOfWords = 0
        const caretPositionIndex = caretPositionRef.current.start + insertedText.length
        
        if (process.env['APP'] === 'web') {
            for (let i=0; i < block.rich_text_block_contents.length; i++) {
                if (stackedNumberOfWords <= caretPositionIndex && block.rich_text_block_contents[i].text.length + stackedNumberOfWords >= caretPositionIndex) {
                    whereCaretPositionShouldGoAfterUpdateRef.current.contentIndex = i
                    whereCaretPositionShouldGoAfterUpdateRef.current.positionInContent = caretPositionIndex - stackedNumberOfWords
                    break
                }
                stackedNumberOfWords = block.rich_text_block_contents[i].text.length + stackedNumberOfWords
            }
        } else {
            if (whereCaretPositionShouldGoAfterUpdateRef.current.start !== null && whereCaretPositionShouldGoAfterUpdateRef.current.end !== null) {
                caretPositionRef.current = {
                    start: whereCaretPositionShouldGoAfterUpdateRef.current.start, 
                    end: whereCaretPositionShouldGoAfterUpdateRef.current.end
                }
                whereCaretPositionShouldGoAfterUpdateRef.current = {
                    start: null,
                    end: null
                }
            }
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This function is used to delete the contents from the state and merge together equal contents
     * 
     * @param {String} insertedText - The text inserted in the content editable.
     */
    const mergeEqualDeleteEmptyAndSetWhereCaretPositionShouldGo = (insertedText) => {
        deleteEmptyContents()
        block.rich_text_block_contents = mergeEqualContentsSideBySide(block.rich_text_block_contents)
        updateWhereCaretPositionShouldGo(insertedText)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Suppose you selected the bold option and now you are inserting the letter: "a"
     * But you are inserting it in the middle of "Cats" content which is not bold so the content becomes: ["Ca", "a", "ts"]
     * As it should be clear in the above "Cats" is first a content, but when we insert "a" in the middle of it we will have 3
     * contents: ["not-bold", "bold", "not-bold"] 
     * So what we need to do is separate this content in 3 different contents. We do this by separating on the opposite direction
     * lets go further:
     * 
     * Suppose the following contents: ["i", "love", "cats"] 
     * The index of the content we will change when we insert the letter "a" is 2. 
     * So what we do is get the "ca" that goes on the left of the text, the new "a" that goes on the middle and last but not least "ts" comes on the right
     * With this we create a new array with [content_of_ca, content_of_a, content_of_ts] to be inserted.
     * Notice that content_of_ca and content_of_ts are equal on types, but have different texts, it is just the
     * "cats" content split into two.
     * 
     * Important: we check if the state of the content has changed (it means it was bold and it's not bold anymore)
     * 
     * @param {Object} content - Check the return of the `createNewContent()` function from the Block component in the index.js 
     * file to read the expected structure of this object
     * @param {BigInteger} startIndexToSelectTextInContent - The index of the start position inside of the content text that will be the middle substring.
     * @param {BigInteger} endIndexToSelectTextInContent -  The index of the end position inside of the content text that will be the middle substring.
     * @param {String} currentText - The current text of the context.
     * @param {String} insertedText - The text that will be in the middle of the existing contents.
     * @param {Object} selectionState - Check object `stateOfSelectionData` for reference
     */
    const addNewContentInTheMiddleOfContent = (content, startIndexToSelectTextInContent, endIndexToSelectTextInContent, currentText, insertedText, selectionState) => {
        const toKeepContentTextLeft = currentText.substring(0, startIndexToSelectTextInContent)
        const toKeepContentTextRight = currentText.substring(endIndexToSelectTextInContent, endIndexToSelectTextInContent + currentText.length)
        const contentLeft = props.createNewContent({
            isBold: content.is_bold, 
            isCode: content.is_code, 
            isItalic: content.is_italic, 
            isUnderline: content.is_underline, 
            latexEquation: content.latex_equation, 
            isCustom: content.is_custom,
            customValue: content.custom_value,
            link: content.link, 
            markerColor: content.marker_color, 
            order: 0, 
            textColor: content.text_color,
            textSize: content.text_size,
            text: toKeepContentTextLeft
        })
        const newContent = props.createNewContent({
            isBold: selectionState.isBold, 
            isItalic: selectionState.isItalic,
            isUnderline: selectionState.isUnderline, 
            isCode: selectionState.isCode,
            isCustom: selectionState.isCustom,
            customValue: selectionState.customValue,
            latexEquation: content.latex_equation, 
            link: content.link, 
            markerColor: selectionState.markerColor, 
            order: 0, 
            textColor: selectionState.textColor,
            textSize: selectionState.textSize,
            text: insertedText
        })
        const contentRight = props.createNewContent({
            isBold: content.is_bold, 
            isItalic: content.is_italic,
            isCode: content.is_code, 
            isUnderline: content.is_underline, 
            latexEquation: content.latex_equation, 
            isCustom: content.is_custom,
            customValue: content.custom_value,
            link: content.link, 
            markerColor: content.marker_color, 
            order: 0, 
            textColor: content.text_color,
            textSize: content.text_size,
            text: toKeepContentTextRight
        })
        return [contentLeft, newContent, contentRight]
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Removes the Text of the contets selected. 
     * You might already know the phrase by now: ["I", "Love", "Cats"] (i actually prefer dogs)
     * 
     * So suppose we select the following contents "ILo|veCa|ts" and then press Backspace.
     * First what you need to notice is that we are updating two contents: 'Love' and 'Cats'
     * The first content is being updated from position 2 to position text.length, and cats is being
     * updated from position 0 to position 2. What this means is that "Lo|ve|" and "|Ca|ts" are what is being
     * updated in EACH CONTENT TEXT.
     * 
     * By now you might already been thinking what do we do. We need to loop between the selected contents and
     * change each content text individually getting the startIndexToSelectTextInContent and endIndexToSelectTextInContent texts
     * 
     * @param {Array<Object>} selectedContents - Check the return of `getSelectedContents()` for reference on the object structure.
     */
    const removeTextInContent = (selectedContents) => {
        const hasDeletedSomeContent = caretPositionRef.current.start !== caretPositionRef.current.end

        selectedContents.forEach(content => {
            // delete contents
            if (hasDeletedSomeContent) {
                const newText = block.rich_text_block_contents[content.contentIndex].text
                    .substr(0, content.startIndexToSelectTextInContent) + block.rich_text_block_contents[content.contentIndex].text
                    .substr(content.endIndexToSelectTextInContent)
                block.rich_text_block_contents[content.contentIndex].text = newText
            }
        })
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Used for inserting text in content or creating new contents.
     * 
     * You know the drill, right? 
     * 
     * ["I", "Love", "Cats"]
     * First it's nice to know it doesn't matter if the user has selected "Love" and "Cats" contents
     * we will always add the content in the first content, so "Love". 
     * This is because the content you are inserting will never be splited between contents 
     * (the text you are inserting WILL NOT BE SPLITED, BUT THE CONTENT on where you are inserting 
     * on might be, more on that later).
     * 
     * So what we do is check two things: Has the user selected a range or did he just set the caret
     * to a certain position? And has the content the same state as the state you are inserting? (the content
     * you are inserting will be bold but the content where you are inserting is not Bold, this should create
     * a new content with is_bold as true)
     * 
     * With this in place we have two cases:
     * 1 - We just need to insert the text in the position, so if the content is "Love" and we are inserting
     * "123" we will have the content with the text "Love123"
     * 2 - The content you are inserting is of another type, so we use `addNewContentInTheMiddleOfContent`
     * function to achieve this.
     * 
     * @param {Array<Object>} selectedContents - Check the return of `getSelectedContents()` for reference on the object structure.
     * @param {String} insertedText - The inserted text, could be a letter or could be a hole word.
     */
    const insertTextInContent = (selectedContents, insertedText) => {
        if (selectedContents.length > 0) {
            const contentToInsertText = selectedContents[0]
            const isRangeSelected = caretPositionRef.current.start !== caretPositionRef.current.end
            // TODO: CHECK MORE STATES
            const isContentStateSameAsStateSelection = stateOfSelection.isBold === contentToInsertText.content.is_bold && 
                                                    stateOfSelection.isItalic === contentToInsertText.content.is_italic &&
                                                    stateOfSelection.isUnderline === contentToInsertText.content.is_underline &&
                                                    stateOfSelection.isCode === contentToInsertText.content.is_code &&
                                                    stateOfSelection.textColor === contentToInsertText.content.text_color &&
                                                    stateOfSelection.textSize === contentToInsertText.content.text_size &&
                                                    stateOfSelection.markerColor === contentToInsertText.content.marker_color

            const currentText = block.rich_text_block_contents[contentToInsertText.contentIndex].text
            
            if ((isContentStateSameAsStateSelection && !isRangeSelected) || isRangeSelected) {
                block.rich_text_block_contents[contentToInsertText.contentIndex].text = currentText.slice(0, contentToInsertText.startIndexToSelectTextInContent) + 
                    insertedText + currentText.slice(contentToInsertText.startIndexToSelectTextInContent)
            } else if (!isRangeSelected) {
                // The text you are inserting have different types (bold, italic, underline) of the selected content
                const contentsToAddInIndex = addNewContentInTheMiddleOfContent(
                    contentToInsertText.content, 
                    contentToInsertText.startIndexToSelectTextInContent, 
                    contentToInsertText.endIndexToSelectTextInContent,
                    currentText, 
                    insertedText,
                    stateOfSelection
                )
                block.rich_text_block_contents[contentToInsertText.contentIndex] = contentsToAddInIndex
                // Reference: https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays
                block.rich_text_block_contents = [].concat.apply([], block.rich_text_block_contents)
            }
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This is fired when the user makes a selection or set the caret to a certain position.
     * 
     * The function gets the contents of where the caret is placed and gets its states.
     * Then we display to the users the states that are COMMON for ALL of the contents.
     * 
     * On ["I", "Love", "Cats"] example if "Love" is Bold and Italic, and "Cats" is just Italic
     * we will display just that the contents are italic (you can look on Google Docs or Microsoft Work to have a better understanding
     * on how this works: write a text, make a part of it bold, and the other bold and underlined, then select the text)
     * 
     * This changes the state, most stuff here changes references, this is one of the few functions that changes directly
     * the state.
     */
    const checkStateOfSelectedElementAndUpdateState = () => {
        const selectedContents = getSelectedContents()
        if (selectedContents.length > 0) {
            const isBold = selectedContents.every(selectedContent => selectedContent.content.is_bold)
            const isItalic = selectedContents.every(selectedContent => selectedContent.content.is_italic)
            const isUnderline = selectedContents.every(selectedContent => selectedContent.content.is_underline)
            const isCode = selectedContents.every(selectedContent => selectedContent.content.is_code)
            const textColor = selectedContents.every((selectedContent, __, array) => selectedContent.content.text_color === array[0].content.text_color)   
            const markerColor = selectedContents.every((selectedContent, __, array) => selectedContent.content.marker_color === array[0].content.marker_color)
            const textSize = selectedContents.every((selectedContent, __, array) => selectedContent.content.text_size === array[0].content.text_size) 

            setStateOfSelection({
                isBold: isBold,
                isItalic: isItalic,
                isUnderline: isUnderline,
                isCode: isCode,
                textSize: (textSize && !['', null, undefined].includes(selectedContents[0].content.text_size)) ? selectedContents[0].content.text_size : 12,
                textColor: (textColor) ? selectedContents[0].content.text_color : '',
                markerColor: (markerColor) ? selectedContents[0].content.marker_color : ''
            })
        }
    }
    // ------------------------------------------------------------------------------------------
    // When the user unselect the input we need to set the state of selection back to null, so all of the buttons
    // appear as unselected
    const onBlur = () => {
        // if we are waiting for a custom content we don't dismiss the active block so this way we know that is 
        // exactly THIS block that will contain the content.
        if (
            props.activeBlock === block.uuid && 
            isWaitingForCustomInput.current === false && 
            isToolbarModalOpen === false
        ) {
            blockStateToPropsBlock()
            activeBlockRef.current = null
            props.updateBlocks(null)
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When we focus the input we check if the current active block is this block, if this block is not the active one we 
     * make it active updating the block, and last but not least we set the caret position in the input. We need to set the caret position
     * because we sometimes focus programatically (see one of the `useEffect` below)
     */
    const onFocus = () => {
        // When we focus we also dismiss the unmanaged content selector)
        if (props.isUnmanagedContentSelectorOpen) {
            props.onOpenUnmanagedContentSelector(false)
        }
        if (props.activeBlock !== block.uuid) {
            blockStateToPropsBlock()
            activeBlockRef.current = block.uuid
            props.updateBlocks(block.uuid, true, props.blockIndex)
        }
        isWaitingForCustomInput.current = false
        if (process.env['APP'] === 'web') {
            isFocusingRef.current = true
            setCaretPositionInInput(block.uuid)
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This function is fired whenever the user makes a selection on the text. It can be either be a click event
     * or select a range. 
     * 
     * It's important to understand the following about `onSelect` on mobile and on the web:
     * - The browser understands that after adding 'A' the caret will move from '|' to 'A|' (the "|" is the caret). 
     * So if A has been inserted now the selection changed from position 0 to position 1. 
     * That's why we use onInput instead in the browser. onInput fires BEFORE the 'A' is inserted in the input, so, before the onSelect event.
     * 
     * The same applies to mobile. And on mobile is even worse because we can't prevent any event from firing and there is
     * no such thing as 'onInput' event.
     * 
     * "Okay, i understand, but what does it do?"
     * 
     * ON WEB:
     * Since we have onInput event, when the state is updated we already used the caretPositionRef on the position that we needed
     * (this means that when we add a string like 'A' in the textInput we need the caretPositionRef at position 0, AND NOT on position 1
     * this means we need the CURRENT state of the caretPositionRef and not the one AFTER the update)
     * So we just update the caretPositionRef.current with the new position of the caret. While also checking the 
     * State Of Selected Element (so it checks if the the selected text is Bold, Italic and so on and updates the toolbar)
     * 
     * ON MOBILE:
     * If a wasKeyDownPressedRef is true this means the onInput is STILL updating the state. So we do not want to change the 
     * `caretPositionRef.current` (we use this caretPosition to know what changed on the text and HOW we should change the contents of the block
     * so it is really important that it remains still while updating the content of the block.)
     * So what we do instead is update the whereCaretPositionShouldGoAfterUpdateRef.current with the next position of the caret
     * (since we just update the caret position reference when no key was pressed, when a key is pressed we will not know the next caretPositionRef
     * to go. So we add this value to an aux variable that updates the caretPositionRef.current after the state was changed:
     * you might want to check updateWhereCaretPositionShouldGo function for mobile)
     * 
     * if wasKeyDownPressedRef.current is false it means the user is not inserting any text but instead just moving the cursor.
     * So we just update the refs and the state.
     * 
     * Notice that we don't use the checkIfCaretPositionIsCustomFixAndSetCaretPosition function Because we can't have the control over the selection
     * on mobile. Yep we know that there is this prop called `selection` that you set the start and end for the text input. But it never
     * seemed to work well on mobile for our use case. If you can make it work, fell free to change the behaviour.
     * 
     * @param {EventEmitter} e - The event fired on onSelect props of TextInput on mobile and of input on web.
     */
    const onSelectText = (e) => {
        if (process.env['APP'] === 'web') {    
            handleArrowNavigationWeb()

            if (!wasKeyDownPressedRef.current) {
                caretPositionRef.current = getSelectionSelectCursorPositionWeb(inputRef.current)
                checkStateOfSelectedElementAndUpdateState()
                checkIfCaretPositionIsCustomFixAndSetCaretPosition()
            }
            if (props.activeBlock !== block.uuid) {
                blockStateToPropsBlock()
                activeBlockRef.current = block.uuid
                props.updateBlocks(block.uuid)
            }
        } else {
            if (!wasKeyDownPressedRef.current) {
                caretPositionRef.current = {start: e.nativeEvent.selection.start, end: e.nativeEvent.selection.end} 
                checkStateOfSelectedElementAndUpdateState()
            } else {
                whereCaretPositionShouldGoAfterUpdateRef.current = {start: e.nativeEvent.selection.start, end: e.nativeEvent.selection.end} 
            }
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Exactly the same as `onFocus`, this handles when the user clicks the text. Nothing fancy.
     * 
     * @param {EventEmitter} e - The event object fired by onClick event 
     */
    const onClickText = (e) => {
        caretPositionRef.current = getSelectionSelectCursorPositionWeb(inputRef.current)
        checkStateOfSelectedElementAndUpdateState()
        if (props.activeBlock !== block.uuid) {
            blockStateToPropsBlock()
            activeBlockRef.current = block.uuid
            props.updateBlocks(block.uuid)
        }
    }
    // ------------------------------------------------------------------------------------------
    /*********************************
     * UNHANDLED CONTENT STARTS HERE *
     *********************************
     * 
     * What this does is: if the text has changed, we get the inserted text and fix the CaretPosition. To get the inserted text
     * we also need the type of the onInput event to understand if we are doing a ctrl+c ctrl+v, adding a line break and so on.
     * The fix on the caret position exists because when the user is removing the text we want to mimic as if the user had selected
     * a word to be removed. So the position is like "iLoveCat|" if we want to delete the "t" at the end we mimic like that was actually
     * "iLoveCa|t|" so as if the user had selected the letter "t", so we can know exaclty which word should be removed. Also the same principle
     * is applied when a user selects "iLove|Cat|" and press delete or backspace.
     * 
     * Then we remove the text in the content and after that insert a new text in the content and last but not least
     * merge equal contents, delete empty and set where caret position should be.
     * 
     * # ONLY ON WEB
     * Before and after updating the contents what we do is insert the '\n' in the end of the last content. We need to do this
     * because there is a bug in the browser that when you press Enter two \n are created. This can cause
     * some weird bugs to happen. To prevent this we just add a new line at the end of the last content.
     * 
     * It's important to notice that before updating we remove this \n from the text that we recieve and from the last content
     * we just add it again after all of the texts was updated
     * 
     * UNHANDLED CONTENTS: 
     * Those contents are contents that should not be handled by the text component itself.
     * What we do is check if the inserted text is to open an unhandled selection box (for example, sometimes you may want that
     * if the user types '@' we will display a list of the users. Sometimes typing the same key we will open a box showing
     * the fields of a formulary, it depends on the context that the rich text is being used)
     * 
     * @param {String} text - The inner text of the inputRef, this is the hole text of the content.
     * @param {String} inputType - Mostly used on browsers, the onInput event fires the type of the event on the input, for reference
     * you can use this list so you can know what types of events onInput emits. https://www.w3.org/TR/input-events-1/ (or you can console
     * log(e.nativeEvent.inputType) as you type on the input)
     * @param {String} insertedText - This is only the text that was inserted, so if you press the letter "a" on your keyboard this will 
     * be only the letter "a" 
     * */
    const onInput = (text, inputType, insertedText=null) => {
        // ------------------------------------------------------------------------------------------
        const getInsertedText = (insertedText, inputType) => {
            if (insertedText === null && inputType === 'insertReplacementText') {
                const splittedInsertedText = text.substring(caretPositionRef.current.start, text.length).split(' ')
                if (splittedInsertedText.length > 0) {
                    insertedText = splittedInsertedText[0]
                    return insertedText.substring(insertedText.length-1, insertedText.length) === '\n' ? insertedText.substring(0, insertedText.length-1) : insertedText
                }
            } else if (insertedText === null && inputType === 'insertLineBreak') {
                return '\n'
            } else if (process.env['APP'] !== 'web' && isSpecialKeydownPressed.current) {
                return ''
            } else if (process.env['APP'] !== 'web' && inputType === 'Enter') {
                return '\n\n'
            } else if (process.env['APP'] !== 'web' && inputType === 'Backspace') {
                return ''
            } else if (insertedText) {
                return insertedText
            }
            return ''
        }
        // ------------------------------------------------------------------------------------------
        const fixCaretPositionIfDelete = (inputType, text, oldText) => {
            const isRangeSelection = caretPositionRef.current.start !== caretPositionRef.current.end
            // User has set the caret to a certain position and did not made a selection.
            if (!isRangeSelection) {
                if ((inputType === 'deleteContentBackward' && process.env['APP'] === 'web') || (inputType === 'Backspace' && process.env['APP'] !== 'web')) {
                    // User has pressed backspace. Make as user have selected the character before
                    caretPositionRef.current.start = caretPositionRef.current.start - (oldText.length - text.length)
                } else if (inputType === 'deleteContentForward') {
                    // User has pressed delete. Make as user have selected the character after
                    caretPositionRef.current.end = caretPositionRef.current.end + (oldText.length - text.length)
                }  
            } 
        }
        // ------------------------------------------------------------------------------------------
        insertedText = getInsertedText(insertedText, inputType)
        let contents = JSON.parse(JSON.stringify(block.rich_text_block_contents))
        // Checks if last character of the last content is a linebreak there is a bug that happens when you do this on normal browsers
        // it adds line breaks at the same time.
        // WEB ONLY, on mobile no such thing happens
        if (process.env['APP'] === 'web') {
            if (contents[contents.length-1].text.substring(contents[contents.length-1].text.length-1,contents[contents.length-1].text.length) === '\n') {
                block.rich_text_block_contents[contents.length-1].text = contents[contents.length-1].text.substring(0, contents[contents.length-1].text.length-1)
            }
            text = text.substring(text.length-1, text.length) === '\n' ? text.substring(0, text.length-1) : text
        }
        let oldText = block.rich_text_block_contents.map(content => content.text).join('')

        fixCaretPositionIfDelete(inputType, text, oldText)
        
        // Opens custom menus when user press a particular key. The menu and the content that will be displayed to the user
        // is fully handled outside of the text component.
        if (props.handleUnmanagedContent && props.handleUnmanagedContent[insertedText]) {
            props.handleUnmanagedContent[insertedText](getCaretCoordinatesWeb())
            props.onOpenUnmanagedContentSelector(true)
            isWaitingForCustomInput.current = true
            customInputCaretPosition.current = JSON.parse(JSON.stringify(caretPositionRef.current))
        } 

        // You must ALWAYS follow that order of functions
        const selectedContents = getSelectedContents()
        removeTextInContent(selectedContents)
        insertTextInContent(selectedContents, insertedText)
        mergeEqualDeleteEmptyAndSetWhereCaretPositionShouldGo(insertedText)

        // Has removed last line break so we need to insert it again, only needed on web, on mobile
        // no such thing is needed
        if (process.env['APP'] === 'web') {
            block.rich_text_block_contents[block.rich_text_block_contents.length-1].text = 
            block.rich_text_block_contents[block.rich_text_block_contents.length-1].text + '\n'
        }
        wasKeyDownPressedRef.current = false
        if (!isSpecialKeydownPressed.current) {
            setBlock({...block})
            blockStateToPropsBlock()
            props.updateBlocks(props.block.uuid)
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When you press enter we send the props upper in the chain of blocks. So if you are pressing enter here but this component
     * is inside a Table block, we will activate the table block enter and not this.
     * 
     * When you press ENTER what you need to do is: 
     * 1 - Get the selected contents, but what metters for us is the last content ONLY the last selected content. 
     * 2 - Gets the selection from `endIndexToSelectTextInContent`. This is the first part we will copy to the next block.
     * 3 - Gets the rest of the contets prior of the selected content and create a new contents array
     * 4 - Update the end of the caret position to the end of the text
     * 5 - Remove the text in the current content, removes the empty content and last but not least merge the contents
     * 6 - Make the caret end position be the start position
     * 7 - Create new block with contents
     * 
     * Example with the following contents ["I", "Lo|ve", "Ca|ts", "VeryMuch"] (the "|" represents the caret position)
     * 1 - Get "Cats" content
     * 2 - "ts" inside of "Cats" is what is going to the next block, the contents of the next block should be: ["ts", "VeryMuch"], this
     * gets only the "ts" part, so the first content
     * 3 - After "Cats" content we have the "VeryMuch" content only, if we had more we would pick all of them. With this we merge "ts" that is
     * the content from the previous step and "VeryMuch" creating the  ["ts", "VeryMuch"] contents array.
     * 4 - ["I", "Lo|ve", "Ca|ts", "VeryMuch"] The contents we remove in this block is not only "ve" and "Ca" but EVERYTHING after that. So what we simulate
     * is the following ["I", "Lo|ve", "Cats", "VeryMuch|"]. We moved the end caret to the end of the string so it's like the user has selected everything.
     * 5 - The content after that will be ["I", "Lo"]
     * 6 - The caret.end position was after "VeryMuch" we move it from position 17 to position 2, so after "Lo|" so the caret positions are fixed and right
     * 7 - Creates a new block with ["ts", "VeryMuch"] contents that we created before
     */
    const onEnter = () => {
        const contextBlocks = props.getContextBlocks()

        if (props.onEnter) {
            props.onEnter(block.uuid)
        } else {
            const oldText = block.rich_text_block_contents.map(content => content.text).join('')
            const selectedContentsForCurrentSelection = getSelectedContents()
            if (selectedContentsForCurrentSelection[selectedContentsForCurrentSelection.length-1] !== undefined) {
                const firstContentToTheNextBlock = JSON.parse(JSON.stringify(selectedContentsForCurrentSelection[selectedContentsForCurrentSelection.length-1]))
        
                firstContentToTheNextBlock.content.text = `${firstContentToTheNextBlock.content.text}`.substring(
                    firstContentToTheNextBlock.endIndexToSelectTextInContent, firstContentToTheNextBlock.content.text.length
                )
                const subsequentContentsToTheNextBlock = JSON.parse(JSON.stringify(block.rich_text_block_contents.slice(firstContentToTheNextBlock.contentIndex+1, block.rich_text_block_contents.length)))
                const contentsOfNextBlock = [firstContentToTheNextBlock.content, ...subsequentContentsToTheNextBlock]
                
                caretPositionRef.current.end = oldText.length
                const selectedContents = getSelectedContents()
                removeTextInContent(selectedContents)
                deleteEmptyContents()
                block.rich_text_block_contents = mergeEqualContentsSideBySide(block.rich_text_block_contents)

                caretPositionRef.current.end = caretPositionRef.current.start

                const indexOfBlockInContext = contextBlocks.findIndex(contextBlock => contextBlock.uuid === block.uuid)
                const newBlock = props.createNewBlock({ 
                    order: contextBlocks.length+1, 
                    richTextBlockContents: contentsOfNextBlock,
                    blockTypeId: props.getBlockTypeIdByName('text'),
                    textOptions: {
                        id: null,
                        alignment_type: props.getAligmentTypeIdByName('left')
                    }
                })
                contextBlocks.splice(indexOfBlockInContext + 1, 0, newBlock)
                activeBlockRef.current = newBlock.uuid
                blockStateToPropsBlock()
                props.updateBlocks(newBlock.uuid)
            }
        }
    }
    // ------------------------------------------------------------------------------------------
    /** 
     * This is really similar to `onRemoveCurrent` but instead of removing the block you are currently in, removes the block after the one you are
     * currently in. It is fired when the user press DELETE on the last caret position of the contents (it means the caret is on the end of the string).
     * 
     * So if you have two blocks with the following texts:
     * > "I Love Cats|" (the "|" is the caret)
     * > " Very Much"
     * 
     * When you press DELETE, the block AFTER the current should be removed and its contents should be appended, so the final block should be:
     * > "I Love Cats| Very Much"
     * 
     * Important 1: 
     * > "I Love Cats"
     * > " Very Much|" (the "|" is the caret)
     * If you press delete in this ocasion nothing will work, because we don't have a next Block from the current Block so nothing to append.
     * 
     * Important 2: On tables and other block types you might want to control the flow and logic in them so you can send a `onRemoveAfter` function prop
     * to control inside of the block how this should work.
     * 
     * Important 3: We always insert the `\n` as the last character of the last content, to make this work without issues we need to remove this character
     * So on the example above the real text would be:
     * > "I Love Cats\n|" (the "|" is the caret)
     * > " Very Much\n"
     * What we do is remove `\n` from "I Love Cats" and THEN append 
     */
    const onRemoveAfter = () => {
        const contextBlocks = props.getContextBlocks()

        if (props.onRemoveAfter) {
            props.onRemoveAfter()
        } else { 
            const indexOfBlockInContext = contextBlocks.findIndex(contextBlock => contextBlock.uuid === block.uuid)
            if (contextBlocks.length - 1 > indexOfBlockInContext+1) {
                const contentsToAppendOnCurrentBlock = JSON.parse(JSON.stringify(contextBlocks[indexOfBlockInContext+1].rich_text_block_contents))
                const currentBlockContents = contextBlocks[indexOfBlockInContext].rich_text_block_contents

                // If the last element char of the lest content is \n we remove it from the text to be ready to append the new content.
                if (/(\n)$/g.test(contextBlocks[indexOfBlockInContext].rich_text_block_contents[currentBlockContents.length-1].text)) {
                    contextBlocks[indexOfBlockInContext].rich_text_block_contents[currentBlockContents.length-1].text = contextBlocks[indexOfBlockInContext].rich_text_block_contents[currentBlockContents.length-1].text.substring(
                        0, contextBlocks[indexOfBlockInContext].rich_text_block_contents[currentBlockContents.length-1].text.length-1
                    )
                }
                block.rich_text_block_contents = block.rich_text_block_contents.concat(contentsToAppendOnCurrentBlock)
                block.rich_text_block_contents = mergeEqualContentsSideBySide(block.rich_text_block_contents)
                contextBlocks.splice(indexOfBlockInContext+1, 1)

                blockStateToPropsBlock()
                activeBlockRef.current = block.uuid
                props.updateBlocks(block.uuid)
            }
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This is fired whenever the user press backspace and is on the caret position 0 on the start and end.
     * 
     * So if you have two blocks with the following texts:
     * > "I Love Cats"
     * > "| Very Much" (the "|" is the caret)
     * 
     * On the second Block the caret is on the position 0 and a range is not selected (start and end position of caret are equal). On this case when 
     * the user press backspace what happens is that we append all of the contents from the CURRENT block to the previous block, so we end up with:
     * > "I Love Cats| Very Much" (the "|" is the caret)
     * 
     * What we are doing is appendind the contents from the CURRENT BLOCK to the PREVIOUS block. The caret should also be focused after
     * 
     * Important 1: 
     * > "|I Love Cats"
     * > " Very Much" (the "|" is the caret)
     * If you press backspace in this ocasion nothing will work, because we don't have a previous Block from the first Block.
     * 
     * Important 2: On tables and other block types you might want to control the flow and logic in them so you can send a onRemoveCurrent function prop
     * to control inside of the block how this should work.
     * 
     * Important 3: We always insert the `\n` as the last character of the last content, to make this work without issues we need to remove this character
     * So on the example above the real text would be:
     * > "I Love Cats\n"
     * > "| Very Much\n" (the "|" is the caret)
     * What we do is remove `\n` from "I Love Cats" and THEN append 
     */
    const onRemoveCurrent = () => {
        const contextBlocks = props.getContextBlocks()

        if (props.onRemoveCurrent) {
            props.onRemoveCurrent()
        } else {
            const indexOfBlockInContext = contextBlocks.findIndex(contextBlock => contextBlock.uuid === block.uuid)
            const contentsForNextBlock = JSON.parse(JSON.stringify(block.rich_text_block_contents))
            // get previous block to focus
            if (indexOfBlockInContext !== 0) {
                const uuidToFocusAfterUpdate = contextBlocks[indexOfBlockInContext - 1].uuid
                
                let previousBlockContents = contextBlocks[indexOfBlockInContext - 1].rich_text_block_contents
                // If the last element is  \n we remove it from the text to be ready to append the new content.
                const previousBlockLastContentText = contextBlocks[indexOfBlockInContext - 1].rich_text_block_contents[previousBlockContents.length-1].text
                if (previousBlockLastContentText.substring(previousBlockLastContentText.length-1, previousBlockLastContentText.length) === '\n') {
                    contextBlocks[indexOfBlockInContext - 1].rich_text_block_contents[previousBlockContents.length-1].text = contextBlocks[indexOfBlockInContext - 1].rich_text_block_contents[previousBlockContents.length-1].text.substring(
                        0, contextBlocks[indexOfBlockInContext - 1].rich_text_block_contents[previousBlockContents.length-1].text.length-1
                    )
                }

                contextBlocks[indexOfBlockInContext - 1].rich_text_block_contents = previousBlockContents.concat(contentsForNextBlock)
                contextBlocks[indexOfBlockInContext - 1].rich_text_block_contents = mergeEqualContentsSideBySide(contextBlocks[indexOfBlockInContext - 1].rich_text_block_contents)
                activeBlockRef.current = uuidToFocusAfterUpdate
                blockStateToPropsBlock()
                if (process.env['APP'] == 'web') {
                    contextBlocks.splice(indexOfBlockInContext, 1)
                    props.updateBlocks(uuidToFocusAfterUpdate)
                } else {
                    props.updateBlocks(uuidToFocusAfterUpdate)
                    setTimeout(() => {
                        if (isMountedRef.current) {
                            contextBlocks.splice(indexOfBlockInContext, 1)
                            props.updateBlocks(uuidToFocusAfterUpdate)
                        }
                    }, 100)
                }
            } else {
                if (process.env['APP'] === 'web') {
                    caretPositionRef.current = getSelectionSelectCursorPositionWeb(inputRef.current)
                }
            }
        }
    }
    // ------------------------------------------------------------------------------------------  
    /**
     * Fired when the user presses the keydown, this runs before the KeyUp event that we use to change the text.
     * Because of this we can cancel the keyUp event here, like "Enter" for creating new blocks.
     * 
     * Right now we focus on 3 key events:
     * - Enter
     * - Backspace
     * - Delete
     * 
     * @param {EventEmitter} e - The event object on  onKeyDown event listener on Mobile and on Web.
     * @param {String} pressedKey - The key that was pressed in the keyboard.
     */
    const onKeyDown = (event, pressedKey) => {
        keyDownPressedRef.current = pressedKey
        if (process.env['APP'] === 'web') {
            handleArrowNavigationWeb()
        }
        // if it's in composition we do not want the caret position to update
        if (!wasKeyDownPressedRef.current && !isInCompositionRef.current) {
            if (process.env['APP'] === 'web') {
                caretPositionRef.current = getSelectionSelectCursorPositionWeb(inputRef.current)
                checkIfCaretPositionIsCustomFixAndSetCaretPosition()
            }
            wasKeyDownPressedRef.current = true
        }
    
        const oldText = block.rich_text_block_contents.map(content => content.text).join('')
        if ((process.env['APP'] === 'web' && keyDownPressedRef.current === 'Enter' && !event.shiftKey)|| (process.env['APP'] !== 'web' && keyDownPressedRef.current === 'Enter')) {
            event.preventDefault()
            event.stopPropagation()
            if (props.onEnter !== null) {
                isSpecialKeydownPressed.current = true
                onEnter()
            }
        } else if (keyDownPressedRef.current === 'Backspace' && caretPositionRef.current && caretPositionRef.current.start === 0 && caretPositionRef.current.end === 0) {
            event.preventDefault()
            event.stopPropagation()
            isSpecialKeydownPressed.current = true
            onRemoveCurrent()
        } else if (keyDownPressedRef.current === 'Delete' && caretPositionRef.current && caretPositionRef.current.start >= oldText.length-1 && caretPositionRef.current.end >= oldText.length-1) {
            event.preventDefault()
            event.stopPropagation()
            isSpecialKeydownPressed.current = true
            onRemoveAfter()
        } else if (keyDownPressedRef.current === '/' && caretPositionRef.current && caretPositionRef.current.start === 0 && caretPositionRef.current.end === 0 && (oldText === '' || oldText === '\n')) {
            isWaitingForBlockSelection.current = true
            props.openBlockSelection()
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Resets the states from the refs when the user releases the key
     * 
     * Also reset the arrowNavigation from the page component 
     */
    const onKeyUp = () => {
        keyDownPressedRef.current = null
        wasKeyDownPressedRef.current = false
        if (
            props.arrowNavigation.isUpPressed || 
            props.arrowNavigation.isDownPressed || 
            props.arrowNavigation.isRightPressed || 
            props.arrowNavigation.isLeftPressed
        ){
            props.setArrowNavigation({
                focusX: null,
                isUpPressed: false,
                isDownPressed: false,
                isRightPressed: false,
                isLeftPressed: false
            })
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This function is kinda simple, first what we do is change the state after the user has clicked a button
     * or not.
     * 
     * Then if the user has selected a range and not set the caret to a single position we need to update the content
     * for that we use the `addNewContentInTheMiddleOfContent` function.
     * It's important to notice that here we loop to every single content that was changed and make changes to each content
     * individually. A lot different than what we do in `insertTextInContent` function
     * 
     * @param {*} type 
     * @param {*} isActive 
     * @param {String} color - Some contents are colors so we use
     */
    const onChangeSelectionState = (type, isActive=false, color='', textSize=12) => {
        const elementIsFocused = process.env['APP'] ? props.activeBlock === block.uuid : true
        if (elementIsFocused) {
            // user has not selected a range but had just set the caret to a position
            switch (type) {
                case 'bold':
                    stateOfSelection.isBold = isActive
                    break
                case 'italic': 
                    stateOfSelection.isItalic = isActive
                    break
                case 'underline':
                    stateOfSelection.isUnderline = isActive
                    break
                case 'code':
                    stateOfSelection.isCode = isActive
                    break
                case 'textColor':
                    stateOfSelection.textColor = color
                    break
                case 'markerColor':
                    stateOfSelection.markerColor = color
                    break
                case 'textSize':
                    stateOfSelection.textSize = textSize
                    break
            }
            setStateOfSelection({...stateOfSelection})
            if (caretPositionRef.current.start !== caretPositionRef.current.end) {
                const selectedContents = getSelectedContents()
                let contents = [...block.rich_text_block_contents]
                let changedText = ''
                selectedContents.forEach(content => {
                    // delete contents

                    // ONLY ON WEB. Since the last element is always \n we remove it from the text to be ready to append the new content.
                    if (process.env['APP'] === 'web') {
                        contents[contents.length-1].text = (contents[contents.length-1].text.substring(contents[contents.length-1].text.length-1,contents[contents.length-1].text.length) === '\n') ? contents[contents.length-1].text.substring(
                            0, contents[contents.length-1].text.length-1
                        ) : contents[contents.length-1].text
                    }
                    const contentCurrentText = contents[content.contentIndex].text
                    const toChangeContentText = contentCurrentText.substring(content.startIndexToSelectTextInContent, content.endIndexToSelectTextInContent)
                    // We need to know what has changed to change it inside of the content, this way we can keep unchanged states.
                    // If your content is underlined but you selected it to be bold (but selected another content that is NOT underlined)
                    // we are able to keep the underline state of this content and change it ONLY to be bold
                    const contentsToAddInIndex = addNewContentInTheMiddleOfContent(
                        content.content, 
                        content.startIndexToSelectTextInContent, 
                        content.endIndexToSelectTextInContent,
                        contentCurrentText, 
                        toChangeContentText,
                        {
                            isBold: type === 'bold' ? stateOfSelection.isBold : content.content.is_bold,
                            isItalic: type === 'italic' ? stateOfSelection.isItalic : content.content.is_italic,
                            isUnderline: type === 'underline' ? stateOfSelection.isUnderline : content.content.is_underline,
                            isCode: type === 'code' ? stateOfSelection.isCode : content.content.is_code,
                            textColor: type === 'textColor' ? stateOfSelection.textColor : content.content.text_color,
                            isCustom: content.content.is_custom,
                            customValue: content.content.custom_value,
                            textSize: type === 'textSize' ? stateOfSelection.textSize : content.content.text_size,
                            markerColor: type === 'markerColor' ? stateOfSelection.markerColor : content.content.marker_color
                        }
                    )
                    // with this the type of the data in the contentIndex of block.rich_text_block_contents chages from object to array
                    // we need to do this because we do it on a for loop, which might affect the further index updates in the array.
                    // You will see that after the forEach we flatten the array of a arrays to a single array.
                    block.rich_text_block_contents[content.contentIndex] = contentsToAddInIndex
                    changedText = changedText + toChangeContentText
                })
                // Reference: https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays
                block.rich_text_block_contents = [].concat.apply([], block.rich_text_block_contents)
                deleteEmptyContents()
                block.rich_text_block_contents = mergeEqualContentsSideBySide(block.rich_text_block_contents)
            } 
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Just a boolean function used to verify if it needs to show to the user a placeholder
     */
    const isToShowPlaceholder = () => {
        return block.rich_text_block_contents.length === 1 && 
        props.activeBlock === block.uuid &&
        props.isEditable &&
        (block.rich_text_block_contents[block.rich_text_block_contents.length-1].text === '\n' ||
        block.rich_text_block_contents[block.rich_text_block_contents.length-1].text === '')
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Changes the alignment of the text to the right, to the center or to the middle.
     * This changes the alignment on the hole block.
     * 
     * @param {BigInteger} alignmentId - The new id of the alignment type to use.
     */
    const onChangeAlignmentType = (alignmentId) => {
        if (props.activeBlock === block.uuid) {
            block.text_option.alignment_type = alignmentId
        }
        blockStateToPropsBlock()
        activeBlockRef.current = props.activeBlock
        props.updateBlocks(props.activeBlock)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Used when user paste on the text content we fire this function. To understand on how we get data from the clipboard here you should check 
     * the following: https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsFile
     * 
     * and this: https://ourcodeworld.com/articles/read/491/how-to-retrieve-images-from-the-clipboard-with-javascript-in-the-browser
     * 
     * With this we can know if the user is pasting an image or if he is pasting a text.
     * If the user is pasting an image we send a props to the block component so it automatically creates a block and updates
     * 
     * @param {EventEmitter} e - The object fired when the user pastes a text in the web
     */
    const onPaste = (e) => {
        e.stopPropagation()
        e.preventDefault()
        const clipboardData = e.clipboardData || window.clipboardData
        const clipboardDataItems = (clipboardData || {})?.items
        let clipboardImage = null
        let clipboardText = null

        if (clipboardDataItems) {
            for (let i = 0; i<clipboardDataItems.length; i++) {
                if ((clipboardDataItems[i].kind == 'string') && (clipboardDataItems[i].type.match('^text/plain'))) {
                    clipboardText = `${clipboardData.getData('Text')}`.split('').filter(char => char.charCodeAt(0) !== 13).join('')
                } else if ((clipboardDataItems[i].kind == 'file') && (clipboardDataItems[i].type.match('^image/'))) {
                    const file = clipboardDataItems[i].getAsFile()
                    clipboardImage = file
                }
            }
        }
        if (clipboardImage) {
            props.onPasteImageInText(clipboardImage)
        } else if (!['', null, undefined].includes(clipboardText)) {
            const textWithPastedData = inputRef.current.innerText.substring(0, caretPositionRef.current.start) + clipboardText + 
                inputRef.current.innerText.substring(caretPositionRef.current.end, inputRef.current.innerText.length)  
            onInput(textWithPastedData, '', clipboardText)
        }
    }
    // ------------------------------------------------------------------------------------------
    useEffect(() => {
        if (JSON.stringify(props.block) !== JSON.stringify(block)) {
            setBlock(JSON.parse(JSON.stringify(props.block)))
        }
    }, [props.activeBlock])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        // WEB ONLY
        if (process.env['APP'] === 'web') {
            let innerHtmlText = ''
            block.rich_text_block_contents.forEach((content, index) => {
                if (content.is_custom) {
                    const { component, text } = props.renderCustomContent(content)
                    block.rich_text_block_contents[index].text = text
                    const CustomContent = component 
                    innerHtmlText = innerHtmlText + renderToString(<CustomContent key={index} content={content}/>)
                } else {
                    innerHtmlText = innerHtmlText + renderToString(
                        <Content 
                        key={index} 
                        content={content} 
                        />
                    )
                }
            })
            setInnerHtml(innerHtmlText)
        }
    })
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        // WEB ONLY
        setCaretPositionInInput(props.activeBlock)
    }, [innerHtml])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (isWaitingForCustomInput.current || props.activeBlock === null) {
            inputRef.current.blur()
        }
        if (props.activeBlock === block.uuid && (!isWaitingForCustomInput.current || !props.isUnmanagedContentSelectorOpen)) {
            isWaitingForCustomInput.current = false
            inputRef.current.focus()
        }
    }, [props.activeBlock, props.unmanagedContentValue, props.isUnmanagedContentSelectorOpen])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        addToolbar()
    }, [props, stateOfSelection])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        // handles unmanaged content. When the user types a key it opens a box so the user can select the options
        // When the user selects an option we change the props of the value, than we this Effect runs.
        // We remove the key that he had typed '@', '#' or any other particular key.
        // And insert this new custom_value in the middle of the content
        if (isWaitingForCustomInput.current && props.activeBlock === block.uuid) {
            caretPositionRef.current = JSON.parse(JSON.stringify(customInputCaretPosition.current))
            isWaitingForCustomInput.current = false
            let selectedContents = getSelectedContents()
            const content = selectedContents[selectedContents.length-1]
            // gets the current text removing the handled caret ('#', '@' and so on)
            const currentText = content.content.text.substring(0, content.startIndexToSelectTextInContent) + content.content.text.substring(content.startIndexToSelectTextInContent + 1, content.content.text.length)
            const contentsToAddInIndex = addNewContentInTheMiddleOfContent(
                content.content, 
                content.startIndexToSelectTextInContent, 
                content.startIndexToSelectTextInContent,
                currentText, 
                props.unmanagedContentValue.toString(),
                {
                    isBold: false,
                    isItalic: false,
                    isUnderline: false,
                    isCode: false,
                    isCustom: true,
                    customValue: props.unmanagedContentValue.toString(),
                    textColor: '',
                    textSize: '',
                    markerColor: ''
                }
            )
            contentsToAddInIndex[1].text = props.renderCustomContent(contentsToAddInIndex[1]).text
            // adds an empty content space after the content, this way we are not blocked from writing.
            // (remember that when it is a custom content, we select the hole element)
            // got this idea from Notion.so
            contentsToAddInIndex.splice(2, 0, props.createNewContent({text: ' ', order: 0}))
            block.rich_text_block_contents[content.contentIndex] = contentsToAddInIndex
            block.rich_text_block_contents = [].concat.apply([], block.rich_text_block_contents)
            mergeEqualDeleteEmptyAndSetWhereCaretPositionShouldGo('')
            // resets the value so we can handle further prop changes.
            props.onChangeUnmanagedContentValue(null)
            props.onOpenUnmanagedContentSelector(false)
            activeBlockRef.current = block.uuid
            blockStateToPropsBlock()
            props.updateBlocks(block.uuid)
        }
    }, [props.unmanagedContentValue])
    /////////////////////////////////////////////////////////////////////////////////////////////
    //########################################################################################//
    const renderMobile = () => {
        return (
            <KeyboardAvoidingView>
                <BlockText
                ref={inputRef} 
                autoCapitalize={'none'}
                autoCompleteType={'off'}
                autoCorrect={false}
                autoFocus={false}
                onFocus={(e) => onFocus()}
                onBlur={(e) => onBlur()}
                multiline={true}
                scrollEnabled={false}
                onKeyPress={(e) => onKeyDown(e, e.nativeEvent.key)}
                onSelectionChange={(e) => onSelectText(e)}
                onChangeText={(text) => {
                    onInput(text, keyDownPressedRef.current, keyDownPressedRef.current)  
                }}
                textAlign={getAlignmentTypeNameById(block.text_option?.alignment_type)}
                value={''}
                >
                    {block.rich_text_block_contents.map((content, index) => {
                        if (index === block.rich_text_block_contents.length - 1 && content.text.substring(content.text.length-1, content.text.length) === '\n') {
                            block.rich_text_block_contents[index].text = content.text.substring(0, content.text.length-1)
                        }
                        if (content.is_custom) {
                            const { component, text } = props.renderCustomContent(content)
                            block.rich_text_block_contents[index].text = text
                            const CustomContent = component 
                            return (
                                <CustomContent key={content.uuid} content={block.rich_text_block_contents[index]}/>
                            )
                        } else if (content.text !== '') {
                            return (
                                <Content 
                                key={content.uuid} 
                                content={block.rich_text_block_contents[index]} 
                                />
                            )
                        } else {
                            return null
                        }
                    })}
                </BlockText>
            </KeyboardAvoidingView>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <div>
                {isToShowPlaceholder() ? (
                    <BlockTextPlaceholderContainer>
                        <BlockTextPlaceholderText>
                            {strings['pt-br']['richTextTextBlockPlaceholder']}
                        </BlockTextPlaceholderText>
                    </BlockTextPlaceholderContainer>
                ) : ''}
                <BlockText
                ref={inputRef} 
                className={'notranslate'}
                spellCheck={true}
                caretColor={(![null, ''].includes(stateOfSelection.textColor) ? stateOfSelection.textColor : '#000')}
                alignmentType={getAlignmentTypeNameById(block.text_option?.alignment_type)}
                onBlur={(e) => onBlur()}
                onPaste={(e) => onPaste(e)}
                onFocus={(e) => onFocus()}
                onDoubleClick={(e) => onSelectText(e)}
                onSelect={(e) => onSelectText(e)}
                onKeyDown={(e) => onKeyDown(e, e.nativeEvent.key)}
                onKeyUp={(e) => {
                    e.preventDefault()
                    onKeyUp()
                }}
                onInput={(e) => {
                    if (isInCompositionRef.current === false) {
                        e.preventDefault()
                        onInput(inputRef.current.innerText, e.nativeEvent.inputType, e.nativeEvent.data)
                    }
                }}
                onCompositionStart = {(e) => {isInCompositionRef.current = true}}
                onCompositionEnd = {(e) => onCompositionEnd(e.nativeEvent.data)}
                onClick={(e) => onClickText(e)}
                contentEditable={props.isEditable} 
                draggabble="false"
                suppressContentEditableWarning={true}
                dangerouslySetInnerHTML={{__html: innerHtml}}
                />  
            </div>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Text