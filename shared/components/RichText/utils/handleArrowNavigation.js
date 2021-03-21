// ------------------------------------------------------------------------------------------
/** 
 * WORKS ONLY FOR WEB
 * 
 * Gets the caret X and Y position so we can display a option above the content, this is used to send for the unmanaged
 * so it can display options on the side of the caret. At the same time this is used for handling arrow navigation in the browser.
 * 
 * @returns {Object} - returns an object with X and Y keys.
 */
const getCaretCoordinatesWeb = () => {
    if (process.env['APP'] === 'web') {
        let x = 0
        let y = 0
        const isSupported = typeof window.getSelection !== "undefined"
        if (isSupported) {
            const selection = window.getSelection()
            if (selection.rangeCount !== 0) {
                const range = selection.getRangeAt(0).cloneRange()
                range.collapse(true)
                const rect = range.getClientRects()[0]
                if (rect) {
                    x = rect.left
                    y = rect.top
                }
            }
        }
        return { 
            x: x, 
            y: y 
        }   
    }
}
// ------------------------------------------------------------------------------------------
/**
 * Got this directly from Notion actually. Saw that they used this for handling the arrow navigation (at least that's what i understood)
 * The idea is that when we move we update the arrowNavigation state object on the rich text component. This state holds the information
 * about where we are moving (is it up, is it down, is it right, and so on.)
 * 
 * The arrowNavigation props also holds the focusX props. This props will have the X position from on where we want to set the caret.
 * With this in hand we can use this non-standard API (which is supported by most modern browsers) called
 * `caretPositionFromPoint` and  `caretRangeFromPoint` to get the range from a specific X and Y value.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Document/caretRangeFromPoint
 * and: https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/caretPositionFromPoint 
 * 
 * Remember that we save the X? How do we get the Y? That's fairly easy. We just geet it by a similar way as
 * we get if the caret is in the highest or lowest position. If the arrow is up, this means we are getting the previous block lowest element. 
 * To get the Y on this case we sum the LowestY with the lowestHeight and subtract by half of the line size.
 * 
 * When the arrow is going up it works in a similar fashion except we use the highest element. Followed by the difference
 * that we use the fontHeight instead of the lineheight and that we do not sum highestY with highestHeight.
 * 
 * After that we update the range object with the new range.
 * 
 * @param {HTMLElement} inputElement - The HTML element of the contentEditable input.
 * @param {Range} newRange - a Range object that will be modified. since it is passed by reference we modify this reference
 * so the actual range you are passing will be modified.
 * @param {Object} arrowNavigation - {
 *      focusX: {BigInteger} - The X position of where to focus.
 *      isUpPressed: {Boolean} - Auto explanatory
 *      isDownPressed: {Boolean} - Auto explanatory
 *      isRightPressed: {Boolean} - Auto explanatory
 *      isLeftPressed: {Boolean} - Auto explanatory
 * }
 */
const setCaretPositionIfArrowNavigationWeb = (inputElement, newRange, arrowNavigation) => {
    let range = null
    let offset = null
    let textNode = null

    if (arrowNavigation.isDownPressed) {
        const highestElement = getHighestAndLowestBiggerContents(inputElement).highest
        const highestFontHeight = parseInt((window.getComputedStyle(highestElement).fontSize || '0px').replace('px', ''))
        const highestY = highestElement.getBoundingClientRect().y
        const yPositionToConsider = highestY + (highestFontHeight / 2)
        if (document.caretPositionFromPoint) {
            range = document.caretPositionFromPoint(arrowNavigation.focusX, yPositionToConsider)
            textNode = range.offsetNode
            offset = range.offset
        } else if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(arrowNavigation.focusX, yPositionToConsider)
            textNode = range.startContainer
            offset = range.startOffset
        }
    } else if (arrowNavigation.isUpPressed) {
        const lowestElement = getHighestAndLowestBiggerContents(inputElement).lowest
        const lowestLineHeight = parseInt((window.getComputedStyle(lowestElement).lineHeight || '0px').replace('px', ''))
        const lowestY = lowestElement.getBoundingClientRect().y
        const lowestHeight = lowestElement.offsetHeight
        const yPositionToConsider = lowestY + lowestHeight - (lowestLineHeight / 2)
        if (document.caretPositionFromPoint) {
            range = document.caretPositionFromPoint(arrowNavigation.focusX, yPositionToConsider)
            textNode = range.offsetNode
            offset = range.offset
        } else if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(arrowNavigation.focusX, yPositionToConsider)
            textNode = range.startContainer
            offset = range.startOffset
        }
    } else if (arrowNavigation.isLeftPressed && inputElement.childNodes[inputElement.childNodes.length-1]) {
        textNode = inputElement.childNodes[inputElement.childNodes.length-1].firstChild
        offset = textNode.length
    }
    newRange.setStart(
        textNode, 
        offset
    )
    newRange.collapse(true)
}
// ------------------------------------------------------------------------------------------
/**
 * This function is used to calculate the highest and lowest spans in the text.
 * 
 * The idea is that: we have many spans in a line, we get the one that is the highest (with the highest line height)
 * and for the lowest we get the highest (with the highest line height) to get the lowest span.
 * 
 * I'll try to draw it for better understanding: The - and | are just to ilustrate the
 * borders of the content
 * 
 * |-------------------------------|
 * | <span>texto</span> <span> MU  |     
 * |ITO</span> <span>longo</span>  |
 * |-------------------------------|
 * 
 * So let's imagine the height of 
 * MU
 * ITO
 * is 25 pixels. and the rest is 12. We need to get the highest and the Lowest spans 
 * of the text block. So the border of each span will be something like
 * |-------------------|
 * | |-------|         |
 * | | texto |    MU   |
 * | |-------|         | 
 * |       |--------|  |
 * | ITO   | longo  |  |
 * |       |--------|  |
 * |-------------------|
 * 
 * Did you notice that both `texto` and `longo` are from small sizes, so they are INSIDE 
 * of the biggest content: `MUITO`? This means that MUITO will be the highest and lowest in this example
 * 
 * Ok, so let's add a new text in the bottom of this text block 
 * |-------------------|
 * | |-------|         |
 * | | texto |    MU   |
 * | |-------|         | 
 * |       |--------|  |
 * | ITO   | longo  |  |
 * |       |--------|  |
 * |-------------------|
 * |-----------|
 * | e grande  |
 * |-----------|
 * Notice now that `e grande` content is outside of the MUITO content. And it is on the very
 * bottom of the block. This means this is the lowest. and MUITO is still the highest content.
 * 
 * But why we do this you might ask. With this we get the fontHeight of this span, and the Y 
 * position. So what we do is sum the Y with the fontHeight and we get the hole area where the caret
 * might be in order to go to the previous block.
 * To the lowest instead of using the fontHeight we use the lineHeight but the idea is similar. 
 * The other difference for the lowest is that we need to sum the Y with the height because the Y
 * gives us the position of the uppest and leftist vertex. When we sum the Y with the height we get the
 * edge position of the bottom and more to the left vertex. So instead of adding, we subtract this value
 * with the lineHeight, so we get the area where the caret should be to go to the next block.
 * 
 * @param {HTMLElement} inputElement - The HTML element of the contentEditable input.
 * 
 * @returns {Object} - {
 *      highest: {HTMLElement} - The highest span element inside of the block
 *      lowest: {HTMLElement} - The lowest span element inside of the block
 * }
 */
const getHighestAndLowestBiggerContents = (inputElement) => {
    let highest = null
    let lowest = null
    inputElement.childNodes.forEach(contentNode => {
        let lowestLineHeight = 0
        let highestLineHeight = 0
        const contentNodeRect = contentNode.getBoundingClientRect()
        const contentLineHeight = parseInt((window.getComputedStyle(contentNode).lineHeight || '0px').replace('px', ''))
        if (highest !== null) highestLineHeight = parseInt((window.getComputedStyle(highest).lineHeight || '0px').replace('px', ''))
        if (lowest !== null) lowestLineHeight = parseInt((window.getComputedStyle(lowest).lineHeight || '0px').replace('px', ''))
        
        if (highest === null || (contentLineHeight > highestLineHeight && contentNodeRect.y <= highest.getBoundingClientRect().y)) {
            highest = contentNode
        }
        if (lowest === null || ((contentNodeRect.y + contentNode.offsetHeight > lowest.getBoundingClientRect().y + lowest.offsetHeight) || (contentLineHeight > lowestLineHeight && contentNodeRect.y + contentNode.offsetHeight >= lowest.getBoundingClientRect().y + lowest.offsetHeight))) {
            lowest = contentNode
        }
    })
    return { 
        highest: highest,
        lowest: lowest
    }
}
// ------------------------------------------------------------------------------------------
/**
 * This checks if the caret is in highest or lowest position, highest position means the caret is in the first line (doesn't matter
 * the size of the text in this line). And lowest position means the caret is in the last line of the text.
 * 
 * We use most logic from `getHighestAndLowestBiggerContents` so you might read it for further understaing on
 * how this function works. 
 * 
 * After we get the highest and lowest contents we check the fontSize of the highest element and sum with the Y
 * with this we get the area of where the caret might be.
 * 
 * Same on lowest, except that Y is the position of the top edge, to get the bottom edge we need to sum Y position with
 * the height of the element. With this in hand we subtract by the lineHeight and get the area of where the caret might be in order to
 * be transversed.
 * 
 * @param {HTMLElement} inputElement - The HTML element of the contentEditable input.
 * 
 * @returns {Object} - {
 *      isHighest: {Boolean} - The caret is in the Highest postion of the text block
        isLowest: {Boolean} - The caret is in the lowest position of the text block
 * }
 */
const caretIsInHighestOrLowestPositionWeb = (inputElement) => {
    let isHighestOrLowest = {
        isHighest: false,
        isLowest: false
    }

    const { highest, lowest } = getHighestAndLowestBiggerContents(inputElement)
    if (highest && lowest) {
        const caretPosition = getCaretCoordinatesWeb()
        const highestFontHeight = parseInt((window.getComputedStyle(highest).fontSize || '0px').replace('px', ''))
        const highestHeight = highest.offsetHeight
        const highestWidth = highest.offsetWidth

        const highestY = highest.getBoundingClientRect().y
        if ((caretPosition.y >= highestY && caretPosition.y <= highestY + highestFontHeight) || (highestWidth === 0 && highestHeight === 0)){
            isHighestOrLowest.isHighest = true
        }
        const lowestLineHeight = parseInt((window.getComputedStyle(lowest).lineHeight || '0px').replace('px', ''))
        const lowestHeight = lowest.offsetHeight
        const lowestWidth = lowest.offsetWidth
        const lowestY = lowest.getBoundingClientRect().y
        if ((caretPosition.y >= lowestY + lowestHeight - lowestLineHeight && caretPosition.y <= lowestY + lowestHeight) || (lowestWidth === 0 && lowestHeight === 0)){
            isHighestOrLowest.isLowest = true
        }
    }
    return isHighestOrLowest
}
// ------------------------------------------------------------------------------------------

export {
    getCaretCoordinatesWeb,
    caretIsInHighestOrLowestPositionWeb,
    setCaretPositionIfArrowNavigationWeb
}