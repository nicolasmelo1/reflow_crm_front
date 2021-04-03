import { 
    getCaretCoordinatesWeb,
    caretIsInHighestOrLowestPositionWeb,
    setCaretPositionIfArrowNavigationWeb 
} from './handleArrowNavigation'

// ------------------------------------------------------------------------------------------
 /**
 * WORKS ONLY FOR WEB
 * - We check if the browser has support for both getSelection and createRange (only IE9 does not support these)
 * - last but not least we get the positions on where the caret should go
 * 
 * Check here for reference: https://stackoverflow.com/a/6249440 on how this works
 * 
 * @param {HTMLElement} inputElement - The HTML element of the contentEditable input.
 * @param {Object} arrowNavigation - {
 *      focusX: {BigInteger} - The X position of where to focus.
 *      isUpPressed: {Boolean} - Auto explanatory
 *      isDownPressed: {Boolean} - Auto explanatory
 *      isRightPressed: {Boolean} - Auto explanatory
 *      isLeftPressed: {Boolean} - Auto explanatory
 * }
 * @param {Boolean} isFocus - Must be true if the user is focusing on the text block, false otherwise.
 * @param {BigInteger} startContentIndex - The index of the content to select. With this we can know on which span element
 * will be the starting position of the caret.
 * @param {BigInteger} startPositionInContent - The index of the start position in the span node.
 * @param {BigInteger} endContentIndex - The index of the content to select. With this we can know on which span element
 * will be the ending position of the caret.
 * @param {BigInteger} endPositionInContent - The index of the end position in the span node.
 */
const setCaretPositionWeb = (inputElement, arrowNavigation, isFocus, startContentIndex, startPositionInContent, endContentIndex=null, endPositionInContent=null) => {
    if (process.env['APP'] === 'web' && typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        const range = document.createRange()
        const selection = window.getSelection()
        range.selectNodeContents(inputElement)
        if (isFocus && arrowNavigation.focusX !== null && !['', '\n'].includes(inputElement.innerText)) {
            setCaretPositionIfArrowNavigationWeb(inputElement, range, arrowNavigation)
        } else if (endContentIndex === null && endPositionInContent === null) {
            const node = inputElement.childNodes[startContentIndex]
            const nodePosition = startPositionInContent
            if (node && node.firstChild) {
                const nodeText = node.firstChild ? node.firstChild : node
                let offset = nodePosition
                if (nodePosition > nodeText.length) {
                    offset = nodeText.textContent.substring(nodeText.textContent.length-1, nodeText.textContent.length) === '\n' ? nodeText.textContent.length-1 :  nodeText.textContent.length
                }
                if (offset > nodeText.textContent.length) offset = 0
                range.setStart(
                    nodeText, 
                    offset
                )
                range.collapse(true)
            } else {
                range.collapse(false) 
            }
        } else {
            const startNode = inputElement.childNodes[startContentIndex]
            const endNode = inputElement.childNodes[endContentIndex]
            const startNodePosition = startPositionInContent
            const endNodePosition = endPositionInContent
            try {
                if (startNode) {
                    range.setStart(
                        startNode.firstChild ? startNode.firstChild : startNode, 
                        startNodePosition
                    )
                } 
                if (endNode) {
                    range.setEnd(
                        endNode.firstChild ? endNode.firstChild : endNode, 
                        endNodePosition
                    )
                }
            } catch {}
        } 
        selection.removeAllRanges()
        selection.addRange(range)
    }
}
// ------------------------------------------------------------------------------------------
/**
 * WORKS ONLY ON WEB 
 * 
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
 * 
 * @returns {Object} - An object with "start" and "end" keys that are both the start position of the selection cursor and the end position
 * of the selection cursor.
 */
const getSelectionSelectCursorPositionWeb = (element) => {
    if (process.env['APP'] === 'web') {
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
}
// ------------------------------------------------------------------------------------------
export {
    getCaretCoordinatesWeb,
    caretIsInHighestOrLowestPositionWeb,
    getSelectionSelectCursorPositionWeb,
    setCaretPositionWeb
}