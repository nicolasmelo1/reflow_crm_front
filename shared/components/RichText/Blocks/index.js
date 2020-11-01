import React from 'react'
import { View } from 'react-native'
import generateUUID from '../../../utils/generateUUID'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Block = (props) => {
    const createNewContent = (options = {}) => {
        const { isBold, isCode, isItalic, isUnderline, latexEquation, link, markerColor, order, text, textColor } = options
        return {
            id: null,
            uuid: generateUUID(),
            is_bold: isBold ? isBold : false,
            is_code: isCode ? isCode : false,
            is_italic: isItalic ? isItalic : false,
            is_underline: isUnderline ? isUnderline : false,
            latex_equation: latexEquation ? latexEquation : null,
            link: link ? link : null,
            marker_color: markerColor ? markerColor : null,
            order: order,
            text: text ? text : '',
            text_color: textColor ? textColor : '',
        }
    }

    const blocks = {
        text: require('./Text'),
        table: require('./Table')
    }

    const newProps = {
        ...props, 
        createNewContent: createNewContent
    }
    const Component = blocks[(props.block.block_type === 2) ? 'table' : 'text'].default
    return <Component {...newProps}/>
}

export default Block