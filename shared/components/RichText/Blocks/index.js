import React, { memo, useState, useEffect } from 'react'
import { View } from 'react-native'
import deepCopy from '../../../utils/deepCopy'
import generateUUID from '../../../utils/generateUUID'
import BlockSelector from '../BlockSelector'
import isEqual from '../../../utils/isEqual'

// TODO: NEED TO RESET THIS
let previousBlockProps = {}

/**
 * This is the Block, the main block, the parent block of all blocks.
 * This component holds all of the functionalities needed for every block. For example. Every block
 * need to have the onDelete and onDuplicate functionality, for when we duplicate a block and for when we 
 * delete an existing block.
 * 
 * We also keep shared functionalities here like: when the user pastes an image on the text it should create
 * a new image block. Functions to create a new Block and to create a new content are also kept here.
 * Everything that is common for all of the blocks must be kept here.
 * 
 * @param {Object} block - The block object, this holds the object of each block. You can check `createNewBlock`
 * function inside of this component for details on the structure of this object.
 * @param {Object} blockCanContainBlocks - Object where every key is a block_type_id and every value is an Array
 * of block_type_ids. We use this so we can prevent the user from adding tables inside of tables. Basically. With this
 * every block that contains children blocks can filter what blocks it must accept as children. Like tables for example.
 * @param {Array<Object>} blockTypes - This is an array of rich_text.block_types. Remember `allowedBlockTypeIds`? we use 
 * that to filter out what block types must be accepted inside of a context. Also we use `blockCanContainBlocks` to filter
 * out what block types are accepted as children. This filters out not only the options of `BlockSelector` component but also
 * the block doesn't even render.
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff 
 * @param {BigInteger} pageId - The id of the current page. A pageId only exists if this page was already saved, otherwise
 * this will be null.
 * @param {Function} addToolbar - Each block can define their own toolbar and customize the way they want. To keep this toolbar
 * in the top of the page on web and in the bottom of the page on mobile we use this function to send all of the parameters needed
 * to render the toolbar for this specific block. You can read more on `addToolbar` method in the RichText component.
 * @param {Object} draftMapHeap - When we duplicate a file, like an image or a attachment, whatever. We actually create a new reference for the same object (not literally)
 * So what this means is, when we upload a file we create a draft in our database, and when we duplicate this image or file we are creating
 * a new reference for the same draft that was created before. What happens is, drafts are temporary, so we need to reupload them again
 * if they still exist. So since the duplicated file is a reference to the original draft, when the draft is removed there is no way for the duplicated file or image
 * to know that the draft was removed. Except we actually save a reference of those changes.
 * @param {Function} onUploadFileToDraft - When the user is uploading a file we usually save a draft, a draft is a temporary file that will only be available
 * for a short period of time. * We use drafts because with them we do not need to upload everything at once, instead we upload them when the user actually
 * insert an image or a file. So when we save, everything will be already saved in the backend, we will not need to upload it
 * @param {Boolean} isEditable - As the name suggests, defines if the rich text can be edited or if it's in read only mode.
 * @param {String} activeBlock - The uuid of the block that is active at the current moment. Only one block can be active at a time.
 * with this we can display the toolbar for the current block or just focus on an input if it's active. This was first created
 * to be able to autofocus on an text input.
 * @param {Function} updateBlocks - We update everything by reference, we do not send ANYTHING to this function only the block that
 * you want to be active. More info can be found on `updateBlocks` function inside of the RichText block
 * @param {Function} setArrowNavigation - Updates the `arrowNavigation` state in the RichText block. Used for transversing between the blocks
 * using the arrow keys.
 * @param {Object} arrowNavigation - The arrowNavigation state from RichText block, check it for further details on the structure.
 * of the object.
 * @param {Array<Object>} contextBlocks - An containing all of the blocks of a context. A context here means that: on a table for example
 * we have a block inside of a block, so we will end up with 2 contexts: The context of the blocks of where the table is part of, and the 
 * context of the blocks inside of the table. THis can be used for transversing the blocks with arrow keys, handling on enter, on delete and 
 * so on. With this we do not mix with one another.
 * @param {Function} getAligmentTypeIdByName - Function that gets the aligment_type_id by a specific aligment name
 * @param {Function} getBlockTypeNameById - Function that returns a block_type name from a specific id
 * @param {Function} getBlockTypeIdByName - Function that returns a block_type_id from a specific block name
 * @param {Function} renderCustomContent - A function that recieves a content as parameter (see `rich_text_block_contents` in
 * `createNewPage()` function to get the structure expected.) And returns a Object with a `component` and `text` keys.
 * The `component` is the component that will be rendered in the middle of the text of a `text` block and `text` is
 * the text that will be inside of this component.
 * @param {Function} handleUnmanagedContent - This is an object where each key of the object is a character that should
 * be typed in the rich text in order to do something. `@` in some contexts might be to show a list of users, in others
 * it might be to show a list of fields. If `@` is being used, you can use `#`, '$', and other to open other options. 
 * The combinations are infinite. The value of each key is a callback function which recieves the X and Y position of the caret
 * in the window, on the browser. So we can display the options next to it.
 * @param {Function} onOpenUnmanagedContentSelector - This is a function to close the UnmanagedContent option when a text block
 * loses focus and such. This way we do not need to handle on the parent when a text loses focus.
 * @param {Boolean} isUnmanagedContentSelectorOpen - Checks if a selector of a custom content is open, so we prevent a text block
 * from being inactive, we can keep it activated inside of the rich text.
 * @param {Function} onChangeUnmanagedContentValue - We use this to change the unmanagedValue recieved by `unmanagedContentValue` props
 * back to null, after it had been used.
 * @param {String} unmanagedContentValue - We use this props to get the selected value all the way to the rich text. So we add this
 * value not to the actual text itself but to the `custom_value` property of the content.
 */
const Block = (props) => {
    const [isBlockSelectionOpen, setIsBlockSelectionOpen] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [customBlockOptions, __] = useState(['image_option', 'list_option', 'table_option', 'text_option'])
    
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
        const block = {
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
        // fixes most issues in the browser by adding a line break on the block.rich_text_block_contents if it's a new block.
        // We need to do this ONLY when creating a new block instead of using this when create a new content, because if so
        // it would cause bugs when we use the `createNewContent` function on contexts where we are not creating a new block.
        if (process.env['APP'] === 'web' && block.rich_text_block_contents.length === 1 && block.rich_text_block_contents[0].text === '') {
            block.rich_text_block_contents[0].text = '\n'
        }
        return block
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
        const duplicateBlock = (blockToDuplicate) => {
            let block = deepCopy(blockToDuplicate)
            block.uuid = generateUUID()
            block.rich_text_block_contents = block.rich_text_block_contents.map(content => {
                content.uuid = generateUUID()
                return content
            })
            customBlockOptions.forEach(option => {
                if (block[option]) {
                    block[option].id = null
                }
            })
            if (block.rich_text_depends_on_blocks && block.rich_text_depends_on_blocks.length > 0) {
                block.rich_text_depends_on_blocks = block.rich_text_depends_on_blocks.map(dependsOnBlock => duplicateBlock(dependsOnBlock))
            }
            return block
        }
        
        if (props.onDuplicateBlock) {
            props.onDuplicateBlock(props.block.uuid)
        } else {
            const block = duplicateBlock(props.block)
            const indexOfBlockInContext = props.contextBlocks.findIndex(block => block.uuid === props.block.uuid)
            props.contextBlocks.splice(indexOfBlockInContext + 1, 0, block)
            props.updateBlocks(null)
        }
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

    const blocks = {
        image: require('./Image'),
        text: require('./Text'),
        table: require('./Table')
    }

    const Container = process.env['APP'] === 'web' ? `div`: View
    const Component = blocks[props.getBlockTypeNameById(props.block.block_type)] ? blocks[props.getBlockTypeNameById(props.block.block_type)].default : null
    return (
        <Container key={props.block.uuid}>
            {isBlockSelectionOpen ? (
                <BlockSelector
                changeBlockType={changeBlockType}
                blockOptions={props.blockTypes}
                setIsBlockSelectionOpen={setIsBlockSelectionOpen}
                />
            ): null}
            {Component ? (
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
                customBlockOptions={customBlockOptions}
                onPasteImageInText={onPasteImageInText}
                openBlockSelection={openBlockSelection}
                createNewContent={createNewContent}
                createNewBlock={createNewBlock}
                />
            ) : null}
        </Container>
    )
}

/**
 * See here for further reference: https://pt-br.reactjs.org/docs/react-api.html#reactmemo
 * And here: https://pt-br.reactjs.org/docs/react-api.html#reactpurecomponent
 * 
 * With this we can prevent rerendering of each block, optimizing A LOT the Rich Text
 * Since we change the props by reference we need a way of getting the previous props so we use our deepCopy function
 * and set it to the global function previousBlockProps function so we can compare the previous with the next props.
 * 
 * If we don't use this you will notice that prevProps and nextProps will be both equal.
 * 
 * @param {Object} prevProps - The previous props, since we update by reference it is equal nextProps
 * @param {Object} nextProps - The next props we use for comparing
 * 
 * @returns {Boolean} - Returns true or false whether the props are equal or not.
 */
const areEqual = (prevProps, nextProps) => {
    if (Object.keys(previousBlockProps).includes(prevProps.block.uuid)) prevProps = previousBlockProps[prevProps.block.uuid]
    let areThemEqual = true
    for (let key of Object.keys(prevProps)) {
        // This is a special case, we only update if the uuids have changed or if the length had changed
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