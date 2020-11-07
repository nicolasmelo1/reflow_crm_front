import React, { useState , useEffect } from 'react'
import { View } from 'react-native'
import Content from '../Content'
import { renderToString } from 'react-dom/server'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Text = (props) => {
    const stateOfSelectionData = {
        isBold: false,
        isItalic: false
    }
    const inputRef = React.useRef(null)
    const caretPositionRef = React.useRef(null)
    const whereCaretPositionShouldGoAfterUpdateRef = React.useRef({
        contentIndex: 0,
        positionInContent: 0
    })
    const [innerHtml, setInnerHtml] = useState('')
    const [stateOfSelection, setStateOfSelection] = useState(stateOfSelectionData)

    /**
     * On the browser, when we update the state, the caret jumps (it means it disappear) so the user needs 
     * to click the element again to make a second edit and so on. It obviously becomes kind of annoying for the user
     * experience.
     * 
     * - First we need to see if the element is defined and if the element is the active element of the document. 
     * (without this all the other text blocks of the document would be focused)
     * - Then we check if the browser has support for both getSelection and createRange (only IE9 does not support these)
     * - last but not least we get the positions on where the caret should go using the `whereCaretPositionShouldGoAfterUpdateRef`
     * 
     * Check here for reference: https://stackoverflow.com/a/6249440 on how this works
     */
    const setCaretPositionInInput = () => {
        if (inputRef.current && inputRef.current === document.activeElement) {
            if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
                const range = document.createRange()
                const selection = window.getSelection()
                
                range.selectNodeContents(inputRef.current)
                const node = inputRef.current.childNodes[whereCaretPositionShouldGoAfterUpdateRef.current.contentIndex]
                const nodePosition = whereCaretPositionShouldGoAfterUpdateRef.current.positionInContent
                range.setStart(
                    node.firstChild ? node.firstChild : node, 
                    nodePosition
                )
                range.collapse(true)

                selection.removeAllRanges()
                selection.addRange(range)
            }
            caretPositionRef.current = getWebSelectionSelectCursorPosition(inputRef.current)
            checkStateOfSelectedElementAndUpdateState()
        }
    }

    /**
     * On the browser we cannot get the selection position by default on a contentEditable element.
     * Because of this we need this function, this function is fired whenever we make a selection and it gives the
     * Start and the End position of the selection in the contentEditable. Suppose you have the following text in you contentEditable:
     * `i love cats` and we select the "LOVE" string the positions will be: 
     * {
     *      start: 2,
     *      end: 5
     * }
     * since index starts at 0.
     * 
     * We use this selection range to determine what has been deleted or what has been changed.
     * 
     * Reference: https://stackoverflow.com/a/4812022
     * 
     * @param {Object} element - The element object on which you get the selection position from, usually this will be the `inputRef.current`
     */
    const getWebSelectionSelectCursorPosition = (element) => {
        let start = 0
        let end = 0
        let selection = null
        const document = element.ownerDocument || element.document
        const window = document.defaultView || document.parentWindow
        if (typeof window.getSelection != "undefined") {
            selection = window.getSelection()
            if (selection.rangeCount > 0) {
                const range = window.getSelection().getRangeAt(0)
                const preCaretRange = range.cloneRange()
                preCaretRange.selectNodeContents(element)
                preCaretRange.setEnd(range.startContainer, range.startOffset)
                start = preCaretRange.toString().length
                preCaretRange.setEnd(range.endContainer, range.endOffset)
                end = preCaretRange.toString().length
            }
        } else if ((selection = document.selection) && selection.type != "Control") {
            const textRange = selection.createRange()
            const preCaretTextRange = document.body.createTextRange()
            preCaretTextRange.moveToElementText(element)
            preCaretTextRange.setEndPoint("EndToStart", textRange)
            start = preCaretTextRange.text.length
            preCaretTextRange.setEndPoint("EndToEnd", textRange)
            end = preCaretTextRange.text.length
        }
        return { 
            start: start, 
            end: end 
        }
    }

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
        const contents = props.block.rich_text_block_contents
        for (let contentIndex=0; contentIndex < contents.length; contentIndex++) {
            const lengthOfContent = contents[contentIndex].text.length
            const stackedNumberOfWordsWithLengthOfContent = stackedNumberOfWords + lengthOfContent
            
            // conditionals to check, first check if user selected a range or just set the caret to a certain position
            // second check if the content is inside of range. And Third checks if content is inside of selection 
            // (IT IS NOT A SELECTION RANGE, here the user has just set a caret position)
            const isRangeSelection = caretPositionRef.current.start !== caretPositionRef.current.end
            const isContentInSelectionRange = caretPositionRef.current.start < stackedNumberOfWordsWithLengthOfContent && stackedNumberOfWords <= caretPositionRef.current.end
            const isContentInSelection = caretPositionRef.current.start <= stackedNumberOfWordsWithLengthOfContent
            
            // Set start and end indexes inside of each content
            const startIndexToSelectTextInContent = (caretPositionRef.current.start - stackedNumberOfWords < 0) ? 0 : caretPositionRef.current.start - stackedNumberOfWords
            const endIndexToSelectTextInContent = (caretPositionRef.current.end - stackedNumberOfWords < lengthOfContent) ? caretPositionRef.current.end - stackedNumberOfWords : lengthOfContent

            // is a Range selection
            if (isRangeSelection && isContentInSelectionRange) {
                selectedContentsArray.push({
                    startIndexToSelectTextInContent: startIndexToSelectTextInContent,
                    endIndexToSelectTextInContent: endIndexToSelectTextInContent,
                    contentIndex: contentIndex, 
                    content: contents[contentIndex]
                })
            // The user just set the caret to a certain position without selecting a range
            } else if (!isRangeSelection && isContentInSelection) {
                selectedContentsArray.push({
                    startIndexToSelectTextInContent: startIndexToSelectTextInContent,
                    endIndexToSelectTextInContent: endIndexToSelectTextInContent,
                    contentIndex: contentIndex, 
                    content: contents[contentIndex]
                })
            }

            if (stackedNumberOfWordsWithLengthOfContent >= caretPositionRef.current.end) {
                break
            }
            stackedNumberOfWords = stackedNumberOfWordsWithLengthOfContent
        }
        return selectedContentsArray
    }

    /**
     * Deletes the content when the text inside of the content is a '' (empty string).
     * Otherwise we keep the content.
     * 
     * This changes the prop directly so no return is expected from this function.
     */
    const deleteEmptyContents = () => {
        let contentsToConsider = []
        
        for (let i=0; i < props.block.rich_text_block_contents.length; i++) {
            if (props.block.rich_text_block_contents[i].text !== '') {
            //if (!/^(\s*)$/g.test(contents[i].text)) {
                contentsToConsider.push(props.block.rich_text_block_contents[i])
            }
        }
        props.block.rich_text_block_contents = contentsToConsider
    }

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
     * After merging texts together, if there are no contents in the new array created we create a new empty content.
     * And after that we add a linebreak (\n) in the last content if it doesn't exist yet.
     * 
     * We need to do this because there is a bug in the browser that when you press Enter two \n are created which can cause
     * some weird bugs to happen. To prevent this we just add a new line at the end of the last content.
     */
    const mergeEqualContentsSideBySide = () => {
        let newContents = []
        let contents = [...props.block.rich_text_block_contents]

        // if two contents that are side by side are equal, create a new content that merge the content text
        while (contents.length > 0) {
            if (contents[1] !== undefined &&
                contents[0].link === contents[1].link &&
                contents[0].is_bold === contents[1].is_bold && 
                contents[0].is_italic === contents[1].is_italic &&
                contents[0].is_code === contents[1].is_code && 
                contents[0].is_underline === contents[1].is_underline && 
                contents[0].marker_color === contents[1].marker_color &&
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

        // add a new line char at the end of the last content to prevent a weird bug from happening
        if (!/^\n$/g.test(newContents[newContents.length -1].text.substr(newContents[newContents.length -1].text.length - 1))) newContents[newContents.length -1].text = newContents[newContents.length -1].text + '\n'

        props.block.rich_text_block_contents = [...newContents]
    }

    /**
     * The name of this function is mostly self explanatory but anyway
     * 
     * When we make changes to the state of the RichText component the caret disappears. So what we need to do
     * is set this caret again in it's position. To do this we use this function alongside with `setCaretPositionInInput`
     * 
     * This function just gets the position where the caret should go, this position are both: The content where the
     * caret should go and the position inside of the content text where the caret should go.
     * 
     * @param {*} insertedText 
     */
    const updateWhereCaretPositionShouldGo = (insertedText) => {
        // Sets the caret position, the caret position to go is the caretPosition start + insertedText length
        // then we need to make this in a for loop so we count each content text length and check if the content is between
        // the caret position to go.
        let stackedNumberOfWords = 0
        const caretPositionIndex = caretPositionRef.current.start + insertedText.length
        for (let i=0; i < props.block.rich_text_block_contents.length; i++) {
            if (stackedNumberOfWords <= caretPositionIndex && props.block.rich_text_block_contents[i].text.length + stackedNumberOfWords >= caretPositionIndex) {
                whereCaretPositionShouldGoAfterUpdateRef.current.contentIndex = i
                whereCaretPositionShouldGoAfterUpdateRef.current.positionInContent = caretPositionIndex - stackedNumberOfWords
                break
            }
            stackedNumberOfWords = props.block.rich_text_block_contents[i].text.length + stackedNumberOfWords
        }
    }

    /**
     * This function is used to delete the contents from the state and merge together equal contents
     */
    const mergeEqualDeleteEmptyAndSetWhereCaretPositionShouldGo = (insertedText) => {
    
        deleteEmptyContents()
        mergeEqualContentsSideBySide()
        updateWhereCaretPositionShouldGo(insertedText)
        /*// add a new line char at the end of the last content to prevent a weird bug from happening
        if (!/^\n$/g.test(newContents[newContents.length -1].text.substr(newContents[newContents.length -1].text.length - 1))) newContents[newContents.length -1].text = newContents[newContents.length -1].text + '\n'
        props.block.rich_text_block_contents = newContents*/
    }

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
     * @param {*} content 
     * @param {*} contentIndex 
     * @param {*} startIndexToSelectTextInContent 
     * @param {*} insertedText 
     */
    const addNewContentInTheMiddleOfContent = (content, startIndexToSelectTextInContent, endIndexToSelectTextInContent, currentText, insertedText) => {
        const toKeepContentTextLeft = currentText.substring(0, startIndexToSelectTextInContent)
        const toKeepContentTextRight = currentText.substring(endIndexToSelectTextInContent, endIndexToSelectTextInContent + currentText.length)
        const contentLeft = props.createNewContent({
            isBold: content.is_bold, 
            isCode: content.is_code, 
            isItalic: content.is_italic, 
            isUnderline: content.is_underline, 
            latexEquation: content.latex_equation, 
            link: content.link, 
            markerColor: content.marker_color, 
            order: 0, 
            textColor: content.text_color,
            text: toKeepContentTextLeft
        })
        const newContent = props.createNewContent({
            isBold: stateOfSelection.isBold, 
            isItalic: stateOfSelection.isItalic,
            isUnderline: content.is_underline, 
            latexEquation: content.latex_equation, 
            link: content.link, 
            markerColor: content.marker_color, 
            order: 0, 
            textColor: content.text_color,
            text: insertedText
        })
        const contentRight = props.createNewContent({
            isBold: content.is_bold, 
            isItalic: content.is_italic,
            isCode: content.is_code, 
            isUnderline: content.is_underline, 
            latexEquation: content.latex_equation, 
            link: content.link, 
            markerColor: content.marker_color, 
            order: 0, 
            textColor: content.text_color,
            text: toKeepContentTextRight
        })
        return [contentLeft, newContent, contentRight]
    }

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
     * @param {*} selectedContents 
     */
    const removeTextInContent = (selectedContents) => {
        const hasDeletedSomeContent = caretPositionRef.current.start !== caretPositionRef.current.end

        selectedContents.forEach(content => {
            // delete contents
            if (hasDeletedSomeContent) {
                const newText = props.block.rich_text_block_contents[content.contentIndex].text
                    .substr(0, content.startIndexToSelectTextInContent) + props.block.rich_text_block_contents[content.contentIndex].text
                    .substr(content.endIndexToSelectTextInContent)
                props.block.rich_text_block_contents[content.contentIndex].text = newText
            }
        })
    }

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
     * So what we do is check two things: Has the user selected a range it or did he just set the caret
     * to a certain position? And has the content the same state as the state you are inserting? (the content
     * you are inserting will be bold but the content where you are inserting is not Bold, this should create
     * a new content)
     * 
     * With this in place we have then two cases:
     * 1 - We just need to insert the text in the position, so if the content is "Love" and we are inserting
     * "123" we will have the content with the text "Love123"
     * 2 - The content you are inserting is of another type, so we use `addNewContentInTheMiddleOfContent`
     * function to achieve this.
     * 
     * @param {*} selectedContents 
     * @param {*} insertedText 
     */
    const insertTextInContent = (selectedContents, insertedText) => {
        const contentToInsertText = selectedContents[0]
        const isRangeSelected = caretPositionRef.current.start !== caretPositionRef.current.end
        // TODO: CHECK MORE STATES
        const isContentStateSameAsStateSelection = stateOfSelection.isBold === contentToInsertText.content.is_bold && 
                                                   stateOfSelection.isItalic === contentToInsertText.content.is_italic
        const currentText = props.block.rich_text_block_contents[contentToInsertText.contentIndex].text
        
        if ((isContentStateSameAsStateSelection && !isRangeSelected) || isRangeSelected) {
            props.block.rich_text_block_contents[contentToInsertText.contentIndex].text = currentText.slice(0, contentToInsertText.startIndexToSelectTextInContent) + 
                insertedText + currentText.slice(contentToInsertText.startIndexToSelectTextInContent)
        } else if (!isRangeSelected) {
            // The text you are inserting have different types (bold, italic, underline) of the selected content
            const contentsToAddInIndex = addNewContentInTheMiddleOfContent(
                contentToInsertText.content, 
                contentToInsertText.startIndexToSelectTextInContent, 
                contentToInsertText.endIndexToSelectTextInContent,
                currentText, 
                insertedText
            )
            props.block.rich_text_block_contents[contentToInsertText.contentIndex] = contentsToAddInIndex
            // Reference: https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays
            props.block.rich_text_block_contents = [].concat.apply([], props.block.rich_text_block_contents)
        }
    }

    /**
     * When the user deletes something we consider as if he had selected the content. What it means is:
     * 
     * Suppose we have the following phrase: "IloveCats" and we place the caret at "IloveCa|ts" (the caret is  "|")
     * The position of the caret in this example will be: start = 7 and end = 7
     * when we press backspace the new phrase will be "IloveCts" but since the start was position 7 we will
     * then place the caret at "IloveCt|s" which is wrong. So what we do in this function is make as the user selected
     * the phrase he wants to delete so "IloveC|a|ts" so the position will be: start = 6 and end = 7
     * When we press delete the new phrase will be "IloveCas" so when the user press "delete" the content
     * the position must be as user had selected the "t" instead of "a".
     * 
     * After this have been made we can then get the inserted text at position.
     * 
     * So always use this before selecting contents.
     * 
     * @param {*} text 
     * @param {*} keyCode 
     */
    const getInsertedTextAndFixCaretPosition = (text, keyCode) => {
        let insertedText = ''
        const oldText = props.block.rich_text_block_contents.map(content => content.text).join('')
        const isRangeSelection = caretPositionRef.current.start !== caretPositionRef.current.end

        // User has set the caret to a certain position
        if (!isRangeSelection) {
            const hasDeletedText = oldText.length > text.length
            // User has deleted some text
            if (hasDeletedText) {
                // User has pressed backspace
                if (keyCode === 8) {
                    // Make as user have selected the character before
                    caretPositionRef.current.start = caretPositionRef.current.start - (oldText.length - text.length)
                }
                // User has pressed delete
                if (keyCode === 46) {
                    // Make as user have selected the character after
                    caretPositionRef.current.end = caretPositionRef.current.end + (oldText.length - text.length)
                }
            } else {
                // User has inserted some text
                const endInsertedTextIndex = text.length - oldText.length + caretPositionRef.current.start
                insertedText = text.substring(caretPositionRef.current.start, endInsertedTextIndex)
            }           
        } 

        // We make a new conditional, remember we fix the caret position in the conditional above.
        if (isRangeSelection) {
            const hasDeletedText = caretPositionRef.current.end - caretPositionRef.current.start === oldText.length - text.length
            if (!hasDeletedText) {
                const endInsertedTextIndex = (caretPositionRef.current.end - caretPositionRef.current.start) - (oldText.length - text.length) + caretPositionRef.current.start
                insertedText = text.substring(caretPositionRef.current.start, endInsertedTextIndex)
            }
        }
        return insertedText
    }

    /**
     * This is fired when the user makes a selection or set the caret to a certain position.
     * 
     * The function gets the contents of where the caret is placed and gets its states.
     * Then we display to the users the states that are COMMON for ALL of the contents.
     * 
     * On ["I", "Love", "Cats"] example if "Love" is Bold and Italic, and "Cats" is just Italic
     * we will display just that the contents are italic (you can look on docs or word to have a better understanding
     * on how this works)
     * 
     * This changes the state, most stuff here changes references, this is one of the few functions that changes directly
     * the state.
     */
    const checkStateOfSelectedElementAndUpdateState = () => {
        const selectedContents = getSelectedContents()
        const isBold = selectedContents.every(selectedContent => selectedContent.content.is_bold)
        const isItalic = selectedContents.every(selectedContent => selectedContent.content.is_italic)
        setStateOfSelection({
            isBold: isBold,
            isItalic: isItalic
        })
    }

    // When the user unselect the input we need to set the state of selection back to null, so all of the buttons
    // appear as unselected
    const onBlur = (e) => {
        setStateOfSelection({
            isBold: false,
            isItalic: false
        })
    }

    // When we focus on the input we get the cursor position and also needs to check the state of the selected
    // element, without doing this on a simple ctrl+tab in you go back to the page the states are not set again
    const onFocus = () => {
        caretPositionRef.current = getWebSelectionSelectCursorPosition(inputRef.current)
        checkStateOfSelectedElementAndUpdateState()
    }

    /**
     * This function is fired whenever the user makes a selection on the text. It can be either be a click event
     * or select a range. 
     * 
     * When the user makes changes like press a key, this function is fired, because of this we need to check
     * the type of the event and map just for mouseups.
     * 
     * @param {*} e 
     */
    const onSelectText = (e) => {
        if (['mouseup'].includes(e.nativeEvent.type)) {
            caretPositionRef.current = getWebSelectionSelectCursorPosition(inputRef.current)
            checkStateOfSelectedElementAndUpdateState()
        }
    }

    /**
     * Exactly the same as `onFocus`
     * 
     * @param {*} e 
     */
    const onClickText = (e) => {
        caretPositionRef.current = getWebSelectionSelectCursorPosition(inputRef.current)
        checkStateOfSelectedElementAndUpdateState()
    }

    /**
     * This is more of a onKeyUp function, what this does is check if the text it has is the same text as it was before
     * if that's the case no changes are made.
     * 
     * What this does is: if the text has changed, we get the inserted text and fix the CaretPosition (
     * more on `getInsertedTextAndFixCaretPosition` function)
     * Then we remove the text in the content and after that insert a new text in the content and last but not least
     * merge equal contents, delete empty and set where caret position should be.
     * 
     * If the text was not changed we just update the cursor position and check the state of the selected element.
     * (because the user might be using the arrows and such)
     * 
     * @param {*} text 
     * @param {*} keyCode 
     */
    const onChangeText = (text, keyCode) => {   
        const oldText = props.block.rich_text_block_contents.map(content => content.text).join('')

        if (oldText !== text) {
            // You must ALWAYS follow that order of functions, the order is important
            const insertedText = getInsertedTextAndFixCaretPosition(text, keyCode)

            const selectedContents = getSelectedContents()
            removeTextInContent(selectedContents)
            insertTextInContent(selectedContents, insertedText)

            mergeEqualDeleteEmptyAndSetWhereCaretPositionShouldGo(insertedText)
            props.updateBlocks()
        } else {
            caretPositionRef.current = getWebSelectionSelectCursorPosition(inputRef.current)
            checkStateOfSelectedElementAndUpdateState()
        }
    }

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
     */
    const onChangeSelectionState = (type, isActive) => {
        // user has not selected a range but had just set the caret to a position
        switch (type) {
            case 'bold':
                stateOfSelection.isBold = isActive
                break
            case 'italic': 
                stateOfSelection.isItalic = isActive
                break
        }
        setStateOfSelection({...stateOfSelection})

        if (caretPositionRef.current.start !== caretPositionRef.current.end) {
            const selectedContents = getSelectedContents()
            let contents = [...props.block.rich_text_block_contents]
            let changedText = ''
            selectedContents.forEach(content => {
                // delete contents
                const contentCurrentText = contents[content.contentIndex].text
                const toChangeContentText = contentCurrentText.substring(content.startIndexToSelectTextInContent, content.endIndexToSelectTextInContent)
                const contentsToAddInIndex = addNewContentInTheMiddleOfContent(
                    content.content, 
                    content.startIndexToSelectTextInContent, 
                    content.endIndexToSelectTextInContent,
                    contentCurrentText, 
                    toChangeContentText
                )
                // with this the type of the data in the contentIndex of props.block.rich_text_block_contents chages from object to array
                // we need to do this because we do it on a for loop, which might affect the further index updates in the array.
                // You will see that after the forEach we flatten the array of a arrays to a single array.
                props.block.rich_text_block_contents[content.contentIndex] = contentsToAddInIndex
                changedText = changedText + toChangeContentText
            })
            // Reference: https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays
            props.block.rich_text_block_contents = [].concat.apply([], props.block.rich_text_block_contents)
            mergeEqualDeleteEmptyAndSetWhereCaretPositionShouldGo(changedText)
            props.updateBlocks()
        }
    }

    useEffect(() => {
        let innerHtmlText = ''
        props.block.rich_text_block_contents.map((content, index) => {
            innerHtmlText = innerHtmlText + renderToString(<Content key={index} content={content}/>)
        })
        setInnerHtml(innerHtmlText)
    })

    useEffect(() => {
        setCaretPositionInInput()
    }, [innerHtml])
    

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <div>
                    <button 
                    onClick={(e) => onChangeSelectionState('bold', !stateOfSelection.isBold)} 
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;}}
                    style={{ color: stateOfSelection.isBold ? '#0dbf7e': '#000'}}>
                        Negrito
                    </button>
                    <button 
                    onClick={(e) => onChangeSelectionState('italic', !stateOfSelection.isItalic)} 
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }}
                    style={{ color: stateOfSelection.isItalic ? '#0dbf7e': '#000'}}>
                        Itálico
                    </button>
                </div>
                <div
                ref={inputRef} 
                onBlur={(e) => {onBlur(e); console.log('Blur')}}
                onFocus={(e) => onFocus()}
                onSelect={(e) => onSelectText(e)}
                onKeyUp={(e) => onChangeText(inputRef.current.textContent, e.keyCode || e.charCode)}
                onClick={(e) => onClickText(e)}
                contentEditable={true} 
                draggabble="false"
                suppressContentEditableWarning={true}
                style={{display: 'inline-block', whiteSpace: 'pre-wrap', wordBreak: 'break-word', width: '100%'}}
                dangerouslySetInnerHTML={{__html: innerHtml}}
                />  
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Text