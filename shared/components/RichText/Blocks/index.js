import React from 'react'
import { View } from 'react-native'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Block = (props) => {
    const onChangeBlock

    const createNewContent = ({ isBold, isCode, isItalic, isUnderline, latexEquation, link, markerColor, order, text, textColor}) => {
        return {
            is_bold: isBold,
            is_code: isCode,
            is_italic: isItalic,
            is_underline: isUnderline,
            latex_equation: latexEquation,
            link: link,
            marker_color: markerColor,
            order: order,
            text: text,
            text_color: textColor,
        }
    }

    const blocks = {
        text: require('./Text'),
        table: require('./Table')
    }
    const newProps = {...props, createNewContent: createNewContent}
    const Component = blocks[(props.block.block_type === 2) ? 'table' : 'text'].default
    return <Component {...newProps}/>
}

export default Block