import React from 'react'
import { View } from 'react-native'
import generateUUID from '../../../utils/generateUUID'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Block = (props) => {
    const createNewContent = (options = {}) => {
        const { 
            isBold, 
            isCode, 
            isItalic, 
            isUnderline, 
            isCustom,
            customValue,
            latexEquation, 
            link, 
            markerColor, 
            order, 
            text, 
            textSize, 
            textColor 
        } = options
        return {
            id: null,
            uuid: generateUUID(),
            text_size: textSize ? textSize: 12,
            is_bold: isBold ? isBold : false,
            is_code: isCode ? isCode : false,
            is_italic: isItalic ? isItalic : false,
            is_underline: isUnderline ? isUnderline : false,
            is_custom: isCustom ? isCustom : false,
            custom_value: customValue ? customValue : null,
            latex_equation: latexEquation ? latexEquation : null,
            link: link ? link : null,
            marker_color: markerColor ? markerColor : null,
            order: order,
            text: text ? text : '',
            text_color: textColor ? textColor : '',
        }
    }

    const createNewTextBlock = (options = {}) => {
        //const textBlockType = props.block.block_type.filter(blockType === 'text')
        const { alignmentTypeId, order, richTextBlockContents } = options

        return {
            id: null,
            uuid: generateUUID(),
            image_option: null,
            list_option: null,
            text_option: {
                id: null,
                alignment_type: alignmentTypeId ? alignmentTypeId : props.getAligmentTypeIdByName('left')
            },
            table_option: null,
            block_type: props.getBlockTypeIdByName('text'),
            order: order,
            rich_text_block_contents: richTextBlockContents ? richTextBlockContents.map(content => ({...content, id: null, uuid: generateUUID()})) : [createNewContent({order: 0, text: '\n'})]
        }
    }

    const blocks = {
        text: require('./Text'),
        table: require('./Table')
    }

    const newProps = {
        ...props, 
        createNewContent: createNewContent,
        createNewTextBlock: createNewTextBlock
    }
    const Component = blocks[(props.block.block_type === 2) ? 'table' : 'text'].default
    return <Component {...newProps}/>
}

export default Block