import React, { useState , useEffect } from 'react'
import { View } from 'react-native'
import Content from '../Content'
import { renderToString } from 'react-dom/server'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Text = (props) => {
    const inputRef = React.useRef(null)
    const caretPositionRef = React.useRef(null)
    const whereCaretPositionShouldGoAfterUpdateRef = React.useRef({
        contentIndex: 0,
        positionInContent: 0
    })
    const [innerHtml, setInnerHtml] = useState('')

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
        }
    }

    /**
     * This function is used to delete the contents from the state and merge together equal contents
     */
    const mergeAndDeleteEmptyContents = () => {
        let newContents = []
        let contentsToConsider = []
        let contents = props.block.rich_text_block_contents
        for (let i=0; i < contents.length; i++) {
            if (!/^(\s*)$/g.test(contents[i].text)) {
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
        // add a new line char at the end of the last content to prevent a weird bug from happening
        if (!/^\n$/g.test(newContents[newContents.length -1].text.substr(newContents[newContents.length -1].text.length - 1))) newContents[newContents.length -1].text = newContents[newContents.length -1].text + '\n'
        props.block.rich_text_block_contents = newContents
    }

    /**
     * Deletes contents and add new text to a content
     */
    const changeContent = (insertedText) => {
        let selectionResult = []
        let stackedNumberOfWords = 0
        let isFirstContentSelected = true
        let contents = props.block.rich_text_block_contents
        const hasDeletedSomeContent = caretPositionRef.current.start !== caretPositionRef.current.end
        for (let contentIndex=0; contentIndex < contents.length; contentIndex++) {
            const lengthOfContent = contents[contentIndex].text.length
            
            if (caretPositionRef.current.start <= stackedNumberOfWords + lengthOfContent && stackedNumberOfWords <= caretPositionRef.current.end) {
                // we do this because if you are selecting 2 contents exactly the size of the selection it considers the previous content. We do this to prevent this.
                // So when the user is selecting a range we DON't consider when cursorPosition.start !== stackedNumberOfWords + lengthOfContent
                // If the user has not select a range but set a cursor at select the end of the content, selects the previous content as it should.
                const startIndexToSelectTextInContent = (caretPositionRef.current.start - stackedNumberOfWords < 0) ? 0 : caretPositionRef.current.start - stackedNumberOfWords
                const endIndexToSelectTextInContent = (caretPositionRef.current.end - stackedNumberOfWords < lengthOfContent) ? caretPositionRef.current.end - stackedNumberOfWords : lengthOfContent
                if ((caretPositionRef.start !== stackedNumberOfWords + lengthOfContent && stackedNumberOfWords + lengthOfContent !== 0) && hasDeletedSomeContent || stackedNumberOfWords + lengthOfContent !== 0 && hasDeletedSomeContent) {
                    // deleted some content
                    
                    const newText = contents[contentIndex].text.substr(0, startIndexToSelectTextInContent) + contents[contentIndex].text.substr(endIndexToSelectTextInContent)
                    props.block.rich_text_block_contents[contentIndex].text = newText
                } 
                if (isFirstContentSelected) {
                    // inserts the new text in the content
                    const currentText = props.block.rich_text_block_contents[contentIndex].text
                    props.block.rich_text_block_contents[contentIndex].text = currentText.slice(0, startIndexToSelectTextInContent) + insertedText + currentText.slice(startIndexToSelectTextInContent)
                    whereCaretPositionShouldGoAfterUpdateRef.current.contentIndex = contentIndex
                    whereCaretPositionShouldGoAfterUpdateRef.current.positionInContent = startIndexToSelectTextInContent + insertedText.length
                    isFirstContentSelected = false
                }
            }
            if (stackedNumberOfWords + lengthOfContent >= caretPositionRef.current.end) {
                break
            }
            stackedNumberOfWords = stackedNumberOfWords + lengthOfContent
        }
        return insertedText
    }

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
        return changeContent(insertedText)
    }

    const onChangeText = (text, keyCode) => {   
        let stackedNumberOfWords = 0
        let blockIndexesInSelection = []
        if (caretPositionRef.current === null || [37, 38, 39, 40].includes(keyCode)) {
            caretPositionRef.current = getWebSelectionSelectCursorPosition(inputRef.current)
        }
        const insertedText = getInsertedTextAndFixCaretPosition(text, keyCode)
        mergeAndDeleteEmptyContents()
        props.updateBlocks()
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
            <div
            ref={inputRef} 
            onSelect={(e) => onSelectText(e)}
            onKeyUp={(e) => onChangeText(inputRef.current.textContent, e.keyCode || e.charCode)}
            onClick={(e) => {return null}}
            contentEditable={true} 
            draggabble="false"
            suppressContentEditableWarning={true}
            style={{display: 'inline-block', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}
            dangerouslySetInnerHTML={{__html: innerHtml}}
            />
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Text