import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import deepCopy from '../../../utils/deepCopy'
import generateUUID from '../../../utils/generateUUID'
import BlockSelector from '../BlockSelector'
/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Block = (props) => {
    const [isBlockSelectionOpen, setIsBlockSelectionOpen] = useState(false)
    const blockSelectorRef = React.useRef(null)

    /**
     * Opens the selection of possible blocks that a user can select.
     */
    const openBlockSelection = () => {
        setIsBlockSelectionOpen(true)
    }

    /**
     * Creates a new content with options if they are defined.
     * 
     * @param {Object} options = {
     *      isBold: {String} - If the new content is bold
     * }
     */
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
            rich_text_block_contents: richTextBlockContents ? richTextBlockContents.map(content => ({...content, id: null, uuid: generateUUID()})) : [createNewContent({order: 0, text: ''})]
        }
    }

    /** 
     * Deletes the current block of the context ONLY if it is not the LAST block of the content.
     * If your block contains other blocks, please implement onDeleteBlock function so you handle the deletion
     * of child blocks in your parent block.
     */
    const onDeleteBlock = () => {
        if (props.onDeleteBlock) {
            props.onDeleteBlock()
        }
        if (props.contextBlocks.length > 1) {
            const indexOfBlockInContext = props.contextBlocks.findIndex(block => block.uuid === props.block.uuid)
            props.contextBlocks.splice(indexOfBlockInContext, 1)
            props.updateBlocks(null)
        }
    }

    const onDuplicateBlock = () => {
        if (props.onDuplicateBlock) {
            props.onDuplicateBlock()
        }
        let block = deepCopy(props.block)
        block.uuid = generateUUID()
        block.rich_text_block_contents = block.rich_text_block_contents.map(block => {
            block.uuid = generateUUID()
            return block
        })
        const indexOfBlockInContext = props.contextBlocks.findIndex(block => block.uuid === props.block.uuid)
        props.contextBlocks.splice(indexOfBlockInContext + 1, 0, block)
        props.updateBlocks(null)
    }

    /** 
     * This is used so we can change the current block type of a block. Notice that when we change the block type
     * we actually change the hole structure of the block data and it cannot be retrieved.
     * 
     * @param {BigInteger} blockTypeId - The instance id of the blockType to use now for the current block.
     */
    const changeBlockType = (blockTypeId) => {
        props.block.block_type = blockTypeId
        setIsBlockSelectionOpen(false)
        props.addToolbar({
            blockUUID: props.block.uuid, 
            obligatoryBlockProps: {
                onDeleteBlock: onDeleteBlock,
                onDuplicateBlock: onDuplicateBlock
            }
        })
        props.updateBlocks(props.block.uuid)
    }

    const onMouseDownWeb = (e) => {
        if (blockSelectorRef.current && !blockSelectorRef.current.contains(e.target)) {
            setIsBlockSelectionOpen(false)
        }
    }

    useEffect(() => {
        props.addToolbar({
            blockUUID: props.block.uuid, 
            obligatoryBlockProps: {
                onDeleteBlock: onDeleteBlock,
                onDuplicateBlock: onDuplicateBlock
            }
        })
    }, [props.activeBlock])

    useEffect(() => {
        if (process.env['APP'] === 'web') {
            document.addEventListener("mousedown", onMouseDownWeb)
        } 
        return () => {
            if (process.env['APP'] === 'web') {
                document.removeEventListener("mousedown", onMouseDownWeb)
            } 
        }
    }, [])

    const blocks = {
        image: require('./Image'),
        text: require('./Text'),
        table: require('./Table')
    }

    // we use this because we always pass the props directly, but since a block can contain another block, we
    // need to update the references to the child and not the parent props. So let's say we defined openBlockSelection
    // in the parent component and the parent component passes this and other props to the children. We need this
    // to prevent adding the openBlockSelection of the parent block and not the child.
    const newProps = {
        ...props, 
        toolbarProps: {
            obligatoryBlockProps: {
                onDeleteBlock: onDeleteBlock,
                onDuplicateBlock: onDuplicateBlock
            }
        },
        onDuplicateBlock: onDuplicateBlock,
        onDeleteBlock: onDeleteBlock,
        openBlockSelection: openBlockSelection,
        createNewContent: createNewContent,
        createNewTextBlock: createNewTextBlock
    }
    const Container = process.env['APP'] === 'web' ? `div`: View
    const Component = blocks[props.getBlockTypeNameById(props.block.block_type)].default
    return (
        <Container>
            {isBlockSelectionOpen ? (
                <BlockSelector
                ref={blockSelectorRef}
                changeBlockType={changeBlockType}
                blockOptions={props.blockTypeOptionsForSelection}
                />
            ): null}
            <Component {...newProps}/>
        </Container>
    )
}

export default Block