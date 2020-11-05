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
     * to click the element again to make a second edit and so on. It obviously becomes kind of annoying in a user
     * experience view.
     * 
     * - First we need to see if the element is defined and if the element is the active element of the document. 
     * (without this all the other text blocks of the document would be focused)
     * - Then we check if the browser has support for both getSelection and createRange (only IE9 does not support these)
     * - last but not least we get the positions on where the caret should go using the `whereCaretPositionShouldGoAfterUpdateRef`
     * 
     * Check here for reference: https://stackoverflow.com/a/6249440 on how this works
     */
    const setCaretPosition = () => {
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
        return { start: start, end: end }
    }
    
    /**
     * 
     * @param {*} e 
     */
    const onSelectText = (e) => {
        if (e.nativeEvent.type === 'mouseup') {
            caretPositionRef.current = getWebSelectionSelectCursorPosition(inputRef.current)
            checkStateOfSelectedElementAndUpdateState()
        }
    }

    /**
     * This function is used to delete the contents from the state and merge together equal contents
     */
    const mergeAndDeleteEmptyContents = (insertedText) => {
        let newContents = []
        let contentsToConsider = []
        let contents = props.block.rich_text_block_contents
        
        for (let i=0; i < contents.length; i++) {
            if (contents[i].text !== '') {
            //if (!/^(\s*)$/g.test(contents[i].text)) {
                contentsToConsider.push(contents[i])
            }
        }
        contents = [...contentsToConsider]
        // if two contents that are side by side are equal, create a new content that merge the content text
        while (contents.length > 0) {
            if (contents[1] !== undefined &&
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
        if (newContents.length === 0) newContents.push(props.createNewContent({order: 0}))

        // Sets the caret position, the caret position to go is the caretPosition start + insertedText length
        // then we need to make this in a for loop so we count each content text length and check if the content is between
        // the caret position to go.
        let stackedNumberOfWords = 0
        const caretPositionIndex = caretPositionRef.current.start + insertedText.length
        for (let i=0; i < newContents.length; i++) {
            if (stackedNumberOfWords <= caretPositionIndex && newContents[i].text.length + stackedNumberOfWords >= caretPositionIndex) {
                whereCaretPositionShouldGoAfterUpdateRef.current.contentIndex = i
                whereCaretPositionShouldGoAfterUpdateRef.current.positionInContent = caretPositionIndex - stackedNumberOfWords
                break
            }
            stackedNumberOfWords = newContents[i].text.length + stackedNumberOfWords
        }
        // add a new line char at the end of the last content to prevent a weird bug from happening
        if (!/^\n$/g.test(newContents[newContents.length -1].text.substr(newContents[newContents.length -1].text.length - 1))) newContents[newContents.length -1].text = newContents[newContents.length -1].text + '\n'
        props.block.rich_text_block_contents = newContents
    }

    /**
     * This returns a list of selected contents.
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
            // (NOT A SELECTION RANGE, here the user has just set a caret position)
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
     * Deletes contents and add new text to a content
     */
    const changeContent = (insertedText) => {
        //let isEditingFirstContentSelected = true
        const hasDeletedSomeContent = caretPositionRef.current.start !== caretPositionRef.current.end
        const selectedContents = getSelectedContents()

        selectedContents.forEach(content => {
            // delete contents
            if (hasDeletedSomeContent) {
                const newText = props.block.rich_text_block_contents[content.contentIndex].text
                    .substr(0, content.startIndexToSelectTextInContent) + props.block.rich_text_block_contents[content.contentIndex].text
                    .substr(content.endIndexToSelectTextInContent)
                props.block.rich_text_block_contents[content.contentIndex].text = newText
            }
        })
        
        // inserts the new text in the content or create a new content if content options changes
        const contentToInsertText = selectedContents[0]
        const isRangeSelected = caretPositionRef.current.start !== caretPositionRef.current.end
        const isContentStateSameAsStateSelection = stateOfSelection.isBold === contentToInsertText.content.is_bold && 
                                                   stateOfSelection.isItalic === contentToInsertText.content.is_italic
        const currentText = props.block.rich_text_block_contents[contentToInsertText.contentIndex].text
        
        if ((isContentStateSameAsStateSelection && !isRangeSelected) || isRangeSelected) {
            props.block.rich_text_block_contents[contentToInsertText.contentIndex].text = currentText.slice(0, contentToInsertText.startIndexToSelectTextInContent) + 
                insertedText + currentText.slice(contentToInsertText.startIndexToSelectTextInContent)
        } else if (!isRangeSelected) {
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
        return insertedText
    }

    /**
     * When the user deletes something we consider as if he had selected the content. What it means is:
     * 
     * Suppose we have the following phrase: "IloveCats" and we place the caret at "IloveCa|ts" (the caret)
     * @param {*} text 
     * @param {*} keyCode 
     */
    const getInsertedTextAndFixCaretPosition = (text, keyCode) => {
        let insertedText = ''
        const oldText = props.block.rich_text_block_contents.map(content => content.text).join('')
        // User has set the caret to a certain position
        if (caretPositionRef.current.end === caretPositionRef.current.start) {
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

        if (caretPositionRef.current.end !== caretPositionRef.current.start) {
            // User has selected a range
            const hasDeletedText = caretPositionRef.current.end - caretPositionRef.current.start === oldText.length - text.length
            if (!hasDeletedText) {
                const endInsertedTextIndex = (caretPositionRef.current.end - caretPositionRef.current.start) - (oldText.length - text.length) + caretPositionRef.current.start
                insertedText = text.substring(caretPositionRef.current.start, endInsertedTextIndex)
            }
        }
        return insertedText
    }

    const checkStateOfSelectedElementAndUpdateState = () => {
        const selectedContents = getSelectedContents()
        const isBold = selectedContents.every(selectedContent => selectedContent.content.is_bold)
        const isItalic = selectedContents.every(selectedContent => selectedContent.content.is_italic)
        setStateOfSelection({
            isBold: isBold,
            isItalic: isItalic
        })
    }

    const onBlur = () => {
        setStateOfSelection({
            isBold: false,
            isItalic: false
        })
    }

    const onChangeText = (text, keyCode) => {   
        if (caretPositionRef.current === null || [37, 38, 39, 40].includes(keyCode)) {
            caretPositionRef.current = getWebSelectionSelectCursorPosition(inputRef.current)
        }
        const insertedText = getInsertedTextAndFixCaretPosition(text, keyCode)
        changeContent(insertedText)
        mergeAndDeleteEmptyContents(insertedText)
        props.updateBlocks()
    }

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
                    content.contentIndex, 
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
            mergeAndDeleteEmptyContents(changedText)
            props.updateBlocks()
        }
    }

    useEffect(() => {
        let innerHtmlText = ''
        props.block.rich_text_block_contents.map((content, index) => {
            innerHtmlText = innerHtmlText + renderToString(<Content key={index} content={content}/>)
        })
        setInnerHtml(innerHtmlText)
        //caretPositionRef.current = getWebSelectionSelectCursorPosition(inputRef.current)
    })

    useEffect(() => {
        setCaretPosition()
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
                onBlur={(e) => onBlur(e)}
                onSelect={(e) => onSelectText(e)}
                onKeyUp={(e) => onChangeText(inputRef.current.textContent, e.keyCode || e.charCode)}
                onClick={(e) => {return null}}
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