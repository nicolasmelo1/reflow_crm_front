import React, { memo, useState, useEffect } from 'react'
import { View } from 'react-native'
import deepCopy from '../../../utils/deepCopy'
import generateUUID from '../../../utils/generateUUID'
import BlockSelector from '../BlockSelector'
import isEqual from '../../../utils/isEqual'

// TODO: NEED TO RESET THIS
let previousBlockProps = {}

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Block = (props) => {
    const [isBlockSelectionOpen, setIsBlockSelectionOpen] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const blockSelectorRef = React.useRef(null)

    /**
     * Important: This has the same name as the addToolbar from the page component, so when a block is calling addToolbar
     * he is calling this function and not the function from the page component. 
     * 
     * THis is a function for adding the toolbar in the root of the page.
     * With this simple function we can maintain a simple API for the components to follow and also allow
     * complex layouts to be created.
     * 
     * So let's start. HOW THE F•C* does this work?
     * - First things first: On the parent component we do not keep the state but instead we keep everything inside
     * of a ref. This way we can prevent rerendering stuff and just rerender when needed.
     * - Second of all you need to add this function on a useEffect hook or a componentDidUpdate, this way after every
     * rerender of your component we can keep track on what is changing and force the rerender of the hole page tree.
     * - Third but not least we save all of the data needed to render a Toolbar. This means we need the following parameters:
     *  - `blockUUID` - The uuid of the current block
     *  - `contentOptionComponent` - The React component of the content options we want to render, these are options of each content
     * of the block. They are usually the same, but sometimes you are not dealing with text, so you want to prevent the user
     * from selecting bold and so on.
     *  - `blockOptionComponent` - The React component of the BLOCK options we want to render, these are options for the specific
     * block you have selected.
     *  - `contentOptionProps` - The props that will go to `contentOptionComponent`
     *  - `blockOptionProps` - The props that will go to `blockOptionComponent`
     * 
     * HOW TO USE THIS:
     * You need to run this function ONLY inside of a useEffect of componentDidUpdate. MAKE SURE YOU ARE LISTENING TO THE
     * the state changes that you need. (for example, here we are listening for changes in props, every other state
     * change is irrelevant. When any of this states changes we want the toolbar to update accordingly.)
     * 
     * @param {Object} toolbarProps - OPTIONAL. The props you want to send to the toolbar. It can be undefined,
     * if its undefined we set a toolbar props ourselves so we send it to the richText, if it's not undefined we pass
     * the props on the tree until calling the richText component addToolbar
     */
    const addToolbar = (toolbarProps) => {
        if (toolbarProps) {
            props.addToolbar(toolbarProps)
        } else {
            props.addToolbar({
                blockUUID: props.block.uuid,
                obligatoryBlockProps: {
                    onDeleteBlock: onDeleteBlock,
                    onDuplicateBlock: onDuplicateBlock
                }
            })
        }
    }

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
            rich_text_block_contents: richTextBlockContents ? richTextBlockContents.map(content => ({...content, id: null, uuid: generateUUID()})) : [createNewContent({order: 0, text: ''})],
            rich_text_depends_on_blocks: []
        }
    }

    /** 
     * Deletes the current block of the context ONLY if it is not the LAST block of the content.
     * If your block contains other blocks, please implement onDeleteBlock function so you handle the deletion
     * of child blocks in your parent block.
     */
    const onDeleteBlock = () => {
        if (props.onDeleteBlock) {
            props.onDeleteBlock(props.block.uuid)
        } else {
            if (props.contextBlocks.length > 1) {
                const indexOfBlockInContext = props.contextBlocks.findIndex(block => block.uuid === props.block.uuid)
                props.contextBlocks.splice(indexOfBlockInContext, 1)
                props.updateBlocks(null)
            }
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
        block.rich_text_block_contents = block.rich_text_block_contents.map(content => {
            content.uuid = generateUUID()
            return content
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
     * Used when the user pastes a image in the text block. We automatically convert it to a image block and add this image
     * to the block. We make all of this in this component because what should handle this special use case is the block itself.
     * 
     * @param {File} file - A file object that the user pasted in the text input. 
     */
    const onPasteImageInText = (file) => {
        props.block.block_type = props.getBlockTypeIdByName('image')
        setImageFile(file)
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

    const Container = process.env['APP'] === 'web' ? `div`: View
    const Component = blocks[props.getBlockTypeNameById(props.block.block_type)].default
    return (
        <Container key={props.block.uuid}>
            {isBlockSelectionOpen ? (
                <BlockSelector
                ref={blockSelectorRef}
                changeBlockType={changeBlockType}
                blockOptions={props.blockTypeOptionsForSelection}
                />
            ): null}
            <Component 
            key={props.block.uuid}
            {...props}
            toolbarProps={{
                blockUUID: props.block.uuid,
                obligatoryBlockProps: {
                    onDeleteBlock: onDeleteBlock,
                    onDuplicateBlock: onDuplicateBlock
                }
            }}
            addToolbar={addToolbar}
            imageFile={imageFile}
            onPasteImageInText={onPasteImageInText}
            openBlockSelection={openBlockSelection}
            createNewContent={createNewContent}
            createNewBlock={createNewBlock}
            />
        </Container>
    )
}

/**
 * With this we can prevent rerendering of each block, optimizing A LOT the Rich Text
 * Since we change the props by reference we need a way of getting the previous props so we use our deepCopy function
 * and set it to the global function previousBlockProps function so we can compare the previous with the next props.
 * 
 * If we don't use this you will notice that prevProps and nextProps will be both equal.
 * 
 * @param {Object} prevProps - The previous props, since we update by reference it is equal nextProps
 * @param {Object} nextProps - The next props we use for comparing
 */
const areEqual = (prevProps, nextProps) => {
    if (Object.keys(previousBlockProps).includes(prevProps.block.uuid)) prevProps = previousBlockProps[prevProps.block.uuid]
    let areThemEqual = true
    for (let key of Object.keys(prevProps)) {
        if (key === 'contextBlocks') {
            const prevPropsBlocksUUID = prevProps[key].map(block => block.uuid)
            const nextPropsBlocksUUID = nextProps[key].map(block => block.uuid)
            if (!isEqual(nextPropsBlocksUUID, prevPropsBlocksUUID)){
                areThemEqual = false
                break
            }
        } else if (Object.prototype.toString.call(prevProps[key]) === '[object Function]' && prevProps[key].toString() !== nextProps[key].toString())  {
            areThemEqual = false
            break
        } else if (JSON.stringify(prevProps[key]) !== JSON.stringify(nextProps[key])) {
            areThemEqual = false
            break
        }   
    }
    previousBlockProps[nextProps.block.uuid] = deepCopy(nextProps)
    return areThemEqual
}

export default memo(Block, areEqual)