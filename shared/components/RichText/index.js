import React from 'react'
import { View, KeyboardAvoidingView, Keyboard } from 'react-native'
import axios from 'axios'
import { connect } from 'react-redux'
import generateUUID from '../../utils/generateUUID'
import isEqual from '../../utils/isEqual'
import deepCopy from '../../utils/deepCopy'
import delay from '../../utils/delay'
import agent from '../../utils/agent'
import actions from '../../redux/actions'
import Toolbar from './Toolbar'
import Block from './Blocks'
import { 
    RichTextContainer,
    RichTextBlocksContainer
} from '../../styles/RichText'

const makeDelay = delay(150)

/**
 * This is the main component of the RichText. This component represents the page of our own rich text.
 * 
 * Yes, we could use stuff like slate.js, draft.js, quill and others but there's a reason on why facebook 
 * and other companies built their own, even with many libraries out there: They have FULL CONTROL over their own
 * rich text and they can adapt it to their own needs without needing to depend on open source software that
 * they doesn't own. And we, as reflow see that making our own Text editor gives us an advantage from other companies
 * like Clickup and Airtable, because we can end up using it in a lot of places and for a lot of use cases, also
 * we can create it fully native so it works on mobile. 
 * So having full control over the funcionality, as tedious as it might be, is crucial for the success of Reflow.
 * With stuff like this we can: 
 * - Share the same code and keep the same functionality between React Native and React. (I haven't found any
 * library for rich text in React that could support both platforms, on React Native we would need to use a WebView
 * which is far from ideal)
 * - We can further create a docs view in which we can compete as close as possible to Notion and Coda and even
 * mimic most of their funcionalities.
 * - We can create a websocket connection from multiple clients for collaboration without relying on third party
 * software or companies (like Clickup that needs to use the product from a third party provider to allow collaboration
 * between clients in their docs)
 * 
 * IMPORTANT: It's important to understand and notice that the rich text is a UNIQUE FEATURE on its own for our 
 * platform. But at the same time it can stand on it's own, it's meant to be extensible for MANY use cases that might
 * exist with it. Like Docs, PDF Generation, a Long Text of a formulary and so on.
 * 
 * @param {String} initialText - This is the text that will be shown to the user as he enters the text editor. This will
 * be a full text and not just a placeholder. This is shown on the first line to him. Normally, if this is not defined
 * the user starts with a blank page with no text in it. It can be hard for some users to find their way, this is why this 
 * is important.
 * @param {Object} initialData - you can check the return function of `createNewPage()` method inside of this component
 * to understand the structure we expect from this props. If this is defined we DO NOT create a new page and instead use the
 * data provided from this props.
 * @param {Function} onStateChange - When the state of the rich text changes we need to propagate all of the data of the 
 * the rich text to the parent (remember that this component should be extensible) And when we do this we need to prevent the 
 * parent from propagating the data back down with `initialData` and end up with an infinite recursion loop.
 * @param {Array<BigInteger>} allowedBlockTypeIds - Sometimes we want to prevent, on a specific context, the user from using
 * some specific block_types. So, we use this parameter to define which block types are permitted to be used on the specific
 * context. If this is not defined we do not prevent the user from using any blocks.
 * @param {Boolean} isEditable - As the name suggests, defines if the rich text can be edited or if it's in read only mode.
 * 
 * /----------------/
 * UNMANAGED CONTENT
 * /----------------/
 * Below, there are props that handles unmanaged content. Unmanaged content is some custom content that exists in the 
 * middle of a text. For some use cases we want to be able to tag users, on others we want to be able to add fields. And so on.
 * All of this is not handled by the Rich Text itself, it must be handled outside of the Rich Text so you can add as many
 * custom contents as you want to the text.
 * 
 * @param {Function} renderCustomContent - A function that recieves a content as parameter (see `rich_text_block_contents` in
 * `createNewPage()` function to get the structure expected.) And returns a Object with a `component` and `text` keys.
 * The `component` is the component that will be rendered in the middle of the text of a `text` block and `text` is
 * the text that will be inside of this component.
 * @param {Object} handleUnmanagedContent - This is an object where each key of the object is a character that should
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
class RichText extends React.Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.flatListRef = React.createRef()
        this.toolbar = React.createRef()
        this.drafts = {}
        this.onFocusHeap = []
        this.nextActiveBlock = null
        this.toolbar.current = {
            blockUUID: null,
            contentOptionComponent: null,
            contentOptionProps: null,
            blockOptionComponent: null,
            blockOptionProps: null
        }
        this.cancelToken = axios.CancelToken
        this.source = null
        this.state = {
            draftMapHeap: {},
            activeBlock: null,
            mobileKeyboardHeight: 0,
            mobileRichTextHeight: 0,
            arrowNavigation: {
                focusX: null,
                isUpPressed: false,
                isDownPressed: false,
                isRightPressed: false,
                isLeftPressed: false
            },
            data: this.props.initialData && Object.keys(this.props.initialData).length !== 0 ? 
                  JSON.parse(JSON.stringify(this.props.initialData)) : this.createNewPage()
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Why do we need this?
     * 
     * When we duplicate a file, like an image or a attachment, whatever. We actually create a new reference for the same object (not literally)
     * So what this means is, when we upload a file we create a draft in our database, and when we duplicate this image or file we are creating
     * a new reference for the same draft that was created before. What happens is, drafts are temporary, so we need to reupload them again
     * if they still exist.
     * 
     * So since the duplicated file is a reference to the original draft, when the draft is removed there is no way for the duplicated file or image
     * to know that the draft was removed. Except we actually save a reference of those changes.
     * 
     * And that is exactly what this does. This updates a object that holds the OLD draft string as key and the new draftString as value. This way 
     * we can easily track those changes and apply them to the duplicates (not the original ones)
     * 
     * @param {String} oldDraftId - The old draft string id that will be the key of our object of the heap
     * @param {String} newDraftId - - The new draft string id that will be the value of our object of the heap
     */
    setDraftMapHeap = (oldDraftId, newDraftId) => {
        if (!['', null, undefined].includes(oldDraftId)) {
            let draftMapHeap = {...this.state.draftMapHeap}
            draftMapHeap[oldDraftId] = newDraftId
            this.setState(state => ({
                ...state,
                draftMapHeap
            }))
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Gets the block id by its name
     * 
     * @param {String} blockName - Returns the id of the block
     * 
     * @returns {BigInteger} - Returns the id of the block from it's name. Can return null
     */
    getBlockTypeIdByName = (blockName) => {
        const blockTypes = this.getBlockTypes()
        for (let i=0; i<blockTypes.length; i++) {
            if (blockTypes[i].name === blockName) {
                return blockTypes[i].id
            }
        }
    } 
    // ------------------------------------------------------------------------------------------
    /**
     * Returns the block name by the id of the block
     * 
     * @param {BigInteger} blockId - A block id.
     * 
     * @returns {String} - The name of the block, can be a text, a list, and so on.
     */
    getBlockTypeNameById = (blockId) => {
        const blockTypes = this.getBlockTypes()

        for (let i=0; i<blockTypes.length; i++) {
            if (blockTypes[i].id === blockId) {
                return blockTypes[i].name
            }
        }
        return null
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Gets the alignment type by the name of the alignment
     * 
     * @param {String} alignmentName - The name of the alignment that you want to retrieve
     */
    getAligmentTypeIdByName = (alignmentName) => {
        if (this.props.types?.rich_text?.alignment_type !== undefined) {
            for (let i=0; i<this.props.types?.rich_text?.alignment_type.length; i++) {
                if (this.props.types.rich_text.alignment_type[i].name === alignmentName) {
                    return this.props.types.rich_text.alignment_type[i].id
                }
            }
        } 
        return null
    }
    // ------------------------------------------------------------------------------------------
    /**
     * ONLY ON MOBILE
     * 
     * Set the rich text height. This will be the height of the scrollview where the user types
     * 
     * @param {BigInteger} height - The height in units, recieved by the onLayout event
     */
    setRichTextHeight = (height) => {
        if (this._isMounted) {
            this.setState(state => ({
                ...state,
                mobileRichTextHeight: height,
            }))
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * WORKS ONLY ON MOBILE
     * 
     * This handles when the arrow key is pressed, used only on web and on text blocks
     * 
     * @param {Object} - {
     *      isUpPressed {Boolean} - If key arrow up is pressed it will be true
     *      isDownPressed {Boolean} - If key arrow down is pressed it will be true
     *      isRightPressed {Boolean} - If key arrow right is pressed it will be true
     *      isLeftPressed {Boolean} - If key arrow left is pressed it will be true
     * }
     */
    setArrowNavigation = ({focusX, isUpPressed, isDownPressed, isRightPressed, isLeftPressed}) => {
        if (this._isMounted) {
            this.setState(state => ({
                ...state,
                arrowNavigation: {
                    focusX: [null, undefined].includes(focusX) ? null : focusX,
                    isUpPressed: [null, undefined].includes(isUpPressed) ? false : isUpPressed,
                    isDownPressed: [null, undefined].includes(isDownPressed) ? false : isDownPressed,
                    isRightPressed: [null, undefined].includes(isRightPressed) ? false : isRightPressed,
                    isLeftPressed: [null, undefined].includes(isLeftPressed) ? false : isLeftPressed
                }
            }))
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * ONLY ON MOBILE
     * 
     * Set the keyboard height. This is the height the keyboard consumes, this way we can shrink the scrollView
     * 
     * @param {BigInteger} height - The height in units, recieved by the keyboardDidShow event
     */
    setKeyboardHeight = (height) => {
        this.setState(state => ({
            ...state,
            mobileKeyboardHeight: height,
        }))
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Event fired when the keyboard or mobile is shown to the user.
     * 
     * @param {object} e - The event API, check for explanation: https://reactnative.dev/docs/keyboard#addlistener
     */
    onKeyboardDidShow = (e) => {
        this.setKeyboardHeight(e.endCoordinates.height)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Event fired when the keyboard or mobile is hidden to the user.
     * 
     * @param {object} e - The event API, check for explanation: https://reactnative.dev/docs/keyboard#addlistener
     */
    onKeyboardDidHide = () => {
        this.setKeyboardHeight(0)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Creates a new Page if none was defined by `initialData` props.
     * 
     * To create a new page we only need to define a new text block with a single content.
     * Use this whenever you want to create a new page.
     */
    createNewPage = () => {
        const initialText = this.props.initialText
        const alignmentType = this.getAligmentTypeIdByName('left')
        const blockType = this.getBlockTypeIdByName('text')

        return {
            id: null,
            raw_text: "",
            rich_text_page_blocks: [
                {
                    id: null,
                    uuid: generateUUID(),
                    image_option: null,
                    list_option: null,
                    text_option: {
                        id: null,
                        alignment_type: alignmentType
                    },
                    table_option: null,
                    block_type: blockType,
                    order: 0,
                    rich_text_depends_on_blocks: [],
                    rich_text_block_contents: [
                        {
                            order: 0,
                            uuid: generateUUID(),
                            text: initialText ? initialText : '',
                            text_size: 12,
                            is_bold: false,
                            is_italic: false,
                            is_underline: false,
                            is_code: false,
                            is_custom: false,
                            custom_value: '',
                            latex_equation: null,
                            marker_color: "",
                            text_color: "",
                            link: null
                        }
                    ]
                }
            ]
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * We update the state by reference, it means this might work like a blackBox for some people.
     * Reference: https://stackoverflow.com/questions/373419/whats-the-difference-between-passing-by-reference-vs-passing-by-value
     * When we pass the block data to the Block components below we pass a reference.
     * It means we pass the location in memory of this object and not a copy. That's exactly how `useRef()` hook
     * works. It bundles your values to an object. An object is always passed between functions as reference
     * and not as value so it is the location in memory.
     * 
     * With a reference when the object changes inside of a function, the object outside the scope of
     * this function will also update. 
     * 
     * In our case, when we update the `block` props inside of the components 
     * since we are updating the reference data, the state here will also be updated. 
     * This happens because the props in our child components DOES NOT HAVE A COPY OF EACH BLOCK OBJECT they hold the actual block object.
     * You can add a `console.log` to this.state inside of this function when you update the props in a child component 
     * to see how this works.
     * 
     * Important: When the state changes here we propagate the changes to the parent. When we propagate the changes to the parent the changes
     * does not propagate back to this component, if that would be the case we would be in an eternal loop.
     */
    updateBlocks = (activeBlock, isFocus=false, blockIndex = null) => {
        // we need this when we set null, we need to check after the next active block is null if we haven't changed it yet. If we haven't then
        // we update the active block to null. We NEED to do this because we have onBlur event, which can cause the toolbar to clip. Since we don't
        // want this from happening, when we set the next active block to null we put this change in a delay, if the state changes before it
        // we don't set it to null.
        this.nextActiveBlock = activeBlock
        // ------------------------------------------------------------------------------------------
        const checkIfLastPageBlockIsEmptyTextAndIfNotAddIt = () => {
            const lastBlockOfPage = this.state.data.rich_text_page_blocks[this.state.data.rich_text_page_blocks.length - 1]
            const lastBlockIsNotAnEmptyTextBlock = this.getBlockTypeNameById(lastBlockOfPage.block_type) !== 'text' || 
            lastBlockOfPage.rich_text_block_contents.length > 1 || 
            lastBlockOfPage.rich_text_block_contents[0] === undefined || 
            !['', '\n'].includes(lastBlockOfPage.rich_text_block_contents[0].text)
            if (lastBlockIsNotAnEmptyTextBlock) {
                const alignmentType = this.getAligmentTypeIdByName('left')
                const blockType = this.getBlockTypeIdByName('text')
                this.state.data.rich_text_page_blocks.push({
                    id: null,
                    uuid: generateUUID(),
                    image_option: null,
                    list_option: null,
                    text_option: {
                        id: null,
                        alignment_type: alignmentType
                    },
                    table_option: null,
                    block_type: blockType,
                    order: 0,
                    rich_text_depends_on_blocks: [],
                    rich_text_block_contents: [
                        {
                            order: 0,
                            uuid: generateUUID(),
                            text: '',
                            text_size: 12,
                            is_bold: false,
                            is_italic: false,
                            is_underline: false,
                            is_code: false,
                            is_custom: false,
                            custom_value: '',
                            latex_equation: null,
                            marker_color: "",
                            text_color: "",
                            link: null
                        }
                    ]
                })
            }
        }
        // ------------------------------------------------------------------------------------------
        const update = (activeBlock) => {
            if (this.props.onStateChange) {
                this.props.onStateChange({...this.state.data})
            }
            if (this._isMounted) {
                checkIfLastPageBlockIsEmptyTextAndIfNotAddIt()
                this.setState(state => ({
                    ...state,
                    activeBlock: activeBlock,
                    data:{...this.state.data}
                }))
            }
        }
        // ------------------------------------------------------------------------------------------
        if (isFocus === true) {
            // the focus heap prevents us from changing the focus too much, when too much onFocus is being fired at once
            // we keep the activeBlock on the heap, so during this time, if the user tries to change the focus of the element
            // we consider the previous focus (so we do not focus on the new element, until the heap becomes empty again)
            // this is because since we are updating the state, on mobile this change can be too much to handle since we run 
            // react native on a js thread separated from the native thread
            this.onFocusHeap.push(activeBlock)
            makeDelay(() => {
                this.onFocusHeap = []
            })

            activeBlock = this.onFocusHeap.length > 0 ? this.onFocusHeap[0] : activeBlock
            if (activeBlock !== this.state.activeBlock) {
                update(activeBlock)
                if (process.env['APP'] !== 'web') {
                    this.flatListRef.current.scrollToIndex({index: blockIndex, viewPosition: 0.5, animated: true})
                }
            }
        } else if (activeBlock === null) {
            // When we dismiss the focus it can cause some weird behaviour. Because some blocks, like text, can have an event for blur (so when the user
            // dismiss the block we update the state here.) 
            makeDelay(() => {
                if (this.nextActiveBlock === null) {
                    update(activeBlock)
                }
            })
        } else {
            update(activeBlock)
        }      
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Used for setting the initial data to the 'data' state inside of this component. 
     * 
     * @param {Object} data - The new data of this component.
     */
    setUpdateData = (data) => {
        this.setState(state => ({
            ...state,
            data: data
        }))
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user is uploading a file we usually save a draft, a draft is a temporary file that will only be available
     * for a short period of time.
     * We use drafts because with them we do not need to upload everything at once, instead we upload them when the user actually
     * insert an image or a file. So when we save, everything will be already saved.
     * 
     * @param {File} file - The file that the user has just uploaded.
     * @param {String} oldDraftId - Optional. This is needed for us when the file is removed and we recieve the update from the webhook.
     * 
     * @returns {String} - Returns a `draftStringId` which is a base64 string containing the draftId
     */
    onUploadFileToDraft = async (file, oldDraftId='') => {
        let draftStringId = ''
        const response = await this.props.onCreateDraftFile(file)
        if (response && response.status === 200) {
            draftStringId = response.data.data.draft_string_id
            this.setDraftMapHeap(oldDraftId, draftStringId)
            this.drafts[draftStringId] = file

            agent.websocket.DRAFT.recieveFileRemoved({
                blockId: '',
                callback: (data) => {
                    if (this._isMounted && [...Object.keys(this.drafts)].includes(data.data.draft_string_id)) {
                        this.onUploadFileToDraft(this.drafts[data.data.draft_string_id], data.data.draft_string_id)
                    }
                }
            })

        }
        return draftStringId
    }
    // ------------------------------------------------------------------------------------------
    /**
     * If the allowedBlockTypeIds is defined it means not all blocks should be available in this context, so what we do is filter 
     * the block_types with only the ones that are allowed in the current context. 
     * 
     * For example: when generating a PDF template we might choose to not let user embed websites in the rich text, so the embed 
     * block will be disabled for this context.
     * 
     * This way we can create as many blocks as we want and need in the rich text but without affecting the many use cases the richText
     * might end up having.
     */
    getBlockTypes = () => {
        if (this.props.allowedBlockTypeIds) {
            return (this.props.types?.rich_text?.block_type || []).filter(blockType => this.props.allowedBlockTypeIds.includes(blockType.id))
        } else {
            return (this.props.types?.rich_text?.block_type || [])
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This function might be a little confusing about how we add the toolbar to the rich text. But the overall idea is simple:
     * 
     * First things first, WE DO NOT save the toolbar data in the state, this is not a good practice according to react itself.
     * Because by doing this we would be sending components to the state also and that's not what we want.
     * 
     * Instead what we do is a lot simpler: we use simple references and use this to define if the rich_text should be rerendered or not
     * 
     * We define if the rich text should be rerendered with the following criteria:
     * - The active block has been changed and the blockUUID recieved is not the same as the activeBlock
     * - The props of the CONTENT options have been changed
     * - The props of the BLOCK options have been changed
     * - The obligatory props have been changed.
     * 
     * If one of these is the case we rerender the hole rich text adding the toolbar
     * 
     * Yep, we could add some stuff to the state and refresh, but making it this way gives us more control, and also
     * we don't need to add the ContentOptions component and the BlockOptions component to the State.
     * 
     * @param {Object} options - {
     *      obligatoryBlockProps: {
     *          onDeleteBlock: {String} - The function that handles when the user clicks to delete this block
     *          onDuplicateBlock: {String} - The function that handles when the user clicks to duplicate a block
     *      }
     *      contentOptionComponent: {React.Component} - Non obligatory set this when you want to make changes to the content,
     *          this is the component that will be loaded on the toolbar to make changes to the content
     *      blockOptionComponent: {React.Component} - Non obligatory set this when you want to make changes to the block,
     *          this is the component that will be loaded on the toolbar with options to make changes to the block
     *      contentOptionProps: {Object} - All of the props you want to pass to contentOptionComponent
     *      blockOptionComponent: {Object} - All of the props you want to pass to blockOptionComponent
     *      blockUUID: {String} - The uuid of the block that this toolbar is for.
     * }
     */
    addToolbar = (options = {}) => {
        if (options?.obligatoryBlockProps?.onDeleteBlock === undefined && 
            options?.obligatoryBlockProps?.onDuplicateBlock === undefined &&
            options?.blockUUID === undefined) {
                throw TypeError('`obligatoryBlockProps` and `blockUUID` are required parameters on the `addToolbar` function')
            }
        else {
            if (
                this.state.activeBlock === options.blockUUID && 
                ( 
                    options.blockUUID !== this.toolbar.current.blockUUID || 
                    !isEqual(options?.contentOptionProps, this.toolbar.current.contentOptionProps) ||
                    !isEqual(options?.blockOptionProps, this.toolbar.current.blockOptionProps) ||
                    !isEqual(options?.obligatoryBlockProps, this.toolbar.current.obligatoryBlockProps)
                )
            ) {
                this.toolbar.current = {
                    blockUUID: options.blockUUID,
                    contentOptionComponent: options?.contentOptionComponent,
                    contentOptionProps: deepCopy(options?.contentOptionProps),
                    blockOptionComponent: options?.blockOptionComponent,
                    blockOptionProps: deepCopy(options?.blockOptionProps),
                    obligatoryBlockProps: deepCopy(options.obligatoryBlockProps)
                }

                this.setState(state => ({
                    ...state
                }))
            }
        }
    }
    // ------------------------------------------------------------------------------------------
    getToolbarProps = () => {
        const ContentOptionComponent = this.toolbar.current.contentOptionComponent
        const BlockOptionComponent = this.toolbar.current.blockOptionComponent
        let toolbarProps = {
            ...this.toolbar.current.obligatoryBlockProps
        }
        if (![null, undefined].includes(this.toolbar.current.contentOptionComponent)) {
            toolbarProps['contentOptions'] = (
                <ContentOptionComponent {...this.toolbar.current.contentOptionProps}/>
            )
        }
        if (![null, undefined].includes(this.toolbar.current.blockOptionComponent)) {
            toolbarProps['blockOptions'] = (
                <BlockOptionComponent {...this.toolbar.current.blockOptionProps}/>
            )
        }
        return toolbarProps
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    componentDidMount = () => {
        this._isMounted = true
        this.source = this.cancelToken.source()
        // When we create a new data rich text we automatically set the initial. 
        // because of this we need to propagate this new data to the parent.
        if (this.props.onStateChange) {
            this.props.onStateChange({...this.state.data})
        }
        this.props.onGetBlockCanContainBlock(this.source)
        if (process.env['APP'] !== 'web') {
            Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow)
            Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide)  
        }
    }
    
    /////////////////////////////////////////////////////////////////////////////////////////////
    componentDidUpdate = (prevProps) => {
        // checks if initialData has changed, than checks if it is the same state defined here
        // and then checks if it is an object. This is used so when we propagate the data to the parent
        // it does not propagate back.
        if (
            !isEqual(this.props.initialData, prevProps.initialData) &&
            !isEqual(this.props.initialData, this.state.data) &&
            this.props.initialData && 
            Object.keys(this.props.initialData).length !== 0
        ) {
            this.setUpdateData(JSON.parse(JSON.stringify(this.props.initialData)))
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    componentWillUnmount = () => {
        this._isMounted = false
        if (process.env['APP'] !== 'web') {
            Keyboard.removeListener('keyboardDidShow', this.onKeyboardDidShow)
            Keyboard.removeListener('keyboardDidHide', this.onKeyboardDidHide)  
        }
        if (this.source) {
            this.source.cancel()
        }

        // Remove drafts, since we will not be using them anymore when unmounting this component
        const draftsToRemove = Object.keys(this.drafts)
        for (let i = 0; i < draftsToRemove.length; i++) {
            this.props.onRemoveDraft(draftsToRemove[i])
        }
    }
    //########################################################################################//
    renderMobile = () => {
        return (
            <RichTextContainer height={this.props.height} onLayout={(e) => this.setRichTextHeight(e.nativeEvent.layout.height)}>
                <RichTextBlocksContainer 
                ref={this.flatListRef}
                style={{
                    height: this.state.mobileKeyboardHeight !== 0 ? 
                            this.state.mobileRichTextHeight - this.state.mobileKeyboardHeight - 163 : 
                            this.state.activeBlock !== null && this.props.isEditable !== false ?
                            this.state.mobileRichTextHeight - 70 : 
                            this.state.mobileRichTextHeight
                }}
                scrollEnabled={true}
                keyboardShouldPersistTaps={'never'}
                data={this.state.data.rich_text_page_blocks}
                keyExtractor={(item) => item.uuid}
                renderItem={({ item, index, __ }) => {
                    return (
                        <Block 
                        block={item} 
                        blockIndex={index}
                        pageId={this.state.data.id}
                        blockCanContainBlocks={this.props.rich_text.blockCanContainBlock}
                        blockTypes={this.getBlockTypes()}
                        types={this.props.types}
                        addToolbar={this.addToolbar}
                        draftMapHeap={this.state.draftMapHeap}
                        onUploadFileToDraft={this.onUploadFileToDraft}
                        isEditable={![null, undefined].includes(this.props.isEditable) ? this.props.isEditable : true}
                        activeBlock={this.state.activeBlock} 
                        updateBlocks={this.updateBlocks} 
                        setArrowNavigation={this.setArrowNavigation}
                        arrowNavigation={this.state.arrowNavigation}
                        contextBlocks={this.state.data.rich_text_page_blocks}
                        renderCustomContent={this.props.renderCustomContent}
                        getAligmentTypeIdByName={this.getAligmentTypeIdByName}
                        getBlockTypeNameById={this.getBlockTypeNameById}
                        getBlockTypeIdByName={this.getBlockTypeIdByName}
                        handleUnmanagedContent={this.props.handleUnmanagedContent}
                        onRemoveUnmanagedContent={this.props.onRemoveUnmanagedContent}
                        unmanagedContentValue={this.props.unmanagedContentValue}
                        isUnmanagedContentSelectorOpen={this.props.isUnmanagedContentSelectorOpen}
                        onOpenUnmanagedContentSelector={this.props.onOpenUnmanagedContentSelector}
                        onChangeUnmanagedContentValue={this.props.onChangeUnmanagedContentValue}
                        />
                    )
                }}
                />
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1}}>
                    {this.state.activeBlock !== null && this.props.isEditable !== false ? (
                        <Toolbar
                        isBlockActive={true}
                        {...this.getToolbarProps()}
                        />
                    ) : null}
                </KeyboardAvoidingView>

            </RichTextContainer>
        )
    }
    //########################################################################################//
    renderWeb = () => {
        return (
            <RichTextContainer className={'rich-text-container'} height={this.props.height}>
                {this.state.activeBlock !== null && this.props.isEditable !== false ? (
                    <Toolbar
                    isBlockActive={true}
                    {...this.getToolbarProps()}
                    />
                ) : ''}
                <RichTextBlocksContainer>
                    {this.state.data.rich_text_page_blocks.map((block, index) => (
                        <Block 
                        key={block.uuid} 
                        block={block} 
                        blockCanContainBlocks={this.props.rich_text.blockCanContainBlock}
                        blockTypes={this.getBlockTypes()}
                        types={this.props.types}
                        pageId={this.state.data.id}
                        addToolbar={this.addToolbar}
                        draftMapHeap={this.state.draftMapHeap}
                        onUploadFileToDraft={this.onUploadFileToDraft}
                        isEditable={![null, undefined].includes(this.props.isEditable) ? this.props.isEditable : true}
                        activeBlock={this.state.activeBlock} 
                        updateBlocks={this.updateBlocks} 
                        setArrowNavigation={this.setArrowNavigation}
                        arrowNavigation={this.state.arrowNavigation}
                        contextBlocks={this.state.data.rich_text_page_blocks}
                        renderCustomContent={this.props.renderCustomContent}
                        getAligmentTypeIdByName={this.getAligmentTypeIdByName}
                        getBlockTypeNameById={this.getBlockTypeNameById}
                        getBlockTypeIdByName={this.getBlockTypeIdByName}
                        handleUnmanagedContent={this.props.handleUnmanagedContent}
                        onRemoveUnmanagedContent={this.props.onRemoveUnmanagedContent}
                        unmanagedContentValue={this.props.unmanagedContentValue}
                        isUnmanagedContentSelectorOpen={this.props.isUnmanagedContentSelectorOpen}
                        onOpenUnmanagedContentSelector={this.props.onOpenUnmanagedContentSelector}
                        onChangeUnmanagedContentValue={this.props.onChangeUnmanagedContentValue}
                        />
                    ))}
                </RichTextBlocksContainer>
            </RichTextContainer>
        )
    }
    //########################################################################################//
    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ types: state.login.types, rich_text: state.rich_text }), actions)(RichText)