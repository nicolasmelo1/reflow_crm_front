import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import deepCopy from '../../../utils/deepCopy'
import delay from '../../../utils/delay'
import generateUUID from '../../../utils/generateUUID'
import BlockSelector from '../BlockSelector'


const makeDelay = delay(200)

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
     *      isBold: {Boolean} - If the new content is bold
     *      isCode: {Boolean} - If the content is a code
     *      isItalic: {Boolean} - If the content is italic
     *      isUnderline: {Boolean} - If the content is underlined 
     *      isCustom: {Boolean} - If the content is a custom content (custom contents are not handled by the Rich text itself)
     *      customValue: {String} - If the content is custom we can use this custom value so the parent components can know what to render
     *      latexEquation: {String} - Not yet defined and handled by the rich text.
     *      link: {String} - Not yet defined and handled by the rich text.
     *      markerColor: {String} - The hex color of the marker (the background color)
     *      order: {BigInteger} - The order of the content, be cautious about it, this can lead to bugs if not set correctly
     *      text: {String} - The value itself of the content.
     *      textSize: {BigInteger} - The size of the text in points for web or pixels for mobile to set.
     *      textColor: {String} - The hex color of the text itself.
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
    
    /**
     * Used for creating a new block.
     * 
     * @param {Object} options = {
     *      order: {BigInteger} - The order of the block, be cautious about it, this can lead to bugs if not set correctly 
     *      richTextBlockContents: {Array<Objects>} - Array of contents, you can look for `createNewContent()` function to see the contract
     *      blockTypeId: {BigInteger} - The id of the block type to use. Is it a text, an image? What is it?
     *      textOption: {Object} - custom options for `text` block types, you should know the contract inside of your block.
     *      listOptions: {Object} - custom options for `list` block types, you should know the contract inside of your block.
     *      imageOptions: {Object} - custom options for `image` block types, you should know the contract inside of your block.
     *      tableOptions: {Object} - custom options for `table` block types, you should know the contract inside of your block.     
     * }
     */
    const createNewBlock = (options = {}) => {
        const { order, richTextBlockContents, blockTypeId} = options
        return {
            id: null,
            uuid: generateUUID(),
            image_option: ![null, undefined].includes(options.imageOptions) ? options.imageOptions : null,
            list_option: ![null, undefined].includes(options.listOptions) ? options.listOptions : null,
            text_option: ![null, undefined].includes(options.textOptions) ? options.textOptions : null,
            table_option: ![null, undefined].includes(options.tableOptions) ? options.tableOptions : null,
            block_type: blockTypeId,
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

    /**
     * Duplicates this current block to a new block below it. When we duplicate we DO NOT automatically select
     * the next one.
     */
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
        props.updateBlocks(props.block.uuid)
    }

    /**
     * This is for closing the block selector container when the user clicks outside of the block selector.
     * 
     * @param {Object} e - The event object.
     */
    const onMouseDownWeb = (e) => {
        if (blockSelectorRef.current && !blockSelectorRef.current.contains(e.target)) {
            setIsBlockSelectionOpen(false)
        }
    }

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
    // in the parent component and the parent component passes this and other props to the children. We need this `newProps` 
    // object to prevent adding the openBlockSelection of the parent block and not the child.
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
        createNewBlock: createNewBlock
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