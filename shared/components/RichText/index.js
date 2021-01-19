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
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
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
        this.CancelToken = axios.CancelToken
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
     * @param {*} newDraftId - - The new draft string id that will be the value of our object of the heap
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

    /**
     * Gets the block id by its name
     * 
     * @param {String} blockName - Returns the id of the block
     * 
     * @returns {BigInteger} - Returns the id of the block from it's name. Can return null
     */
    getBlockTypeIdByName = (blockName) => {
        if (this.props.types?.rich_text?.block_type !== undefined) {
            for (let i=0; i<this.props.types?.rich_text?.block_type.length; i++) {
                if (this.props.types.rich_text.block_type[i].name === blockName) {
                    return this.props.types.rich_text.block_type[i].id
                }
            }
        } return null
    } 
    
    /**
     * Returns the block name by the id of the block
     * 
     * @param {BigInteger} blockId - A block id.
     * 
     * @returns {String} - The name of the block, can be a text, a list, and so on.
     */
    getBlockTypeNameById = (blockId) => {
        if (this.props.types?.rich_text?.block_type !== undefined) {
            for (let i=0; i<this.props.types?.rich_text?.block_type.length; i++) {
                if (this.props.types.rich_text.block_type[i].id === blockId) {
                    return this.props.types.rich_text.block_type[i].name
                }
            }
        } return null
    }

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

    /**
     * Event fired when the keyboard or mobile is shown to the user.
     * 
     * @param {object} e - The event API, check for explanation: https://reactnative.dev/docs/keyboard#addlistener
     */
    onKeyboardDidShow = (e) => {
        this.setKeyboardHeight(e.endCoordinates.height)
    }
    
    /**
     * Event fired when the keyboard or mobile is hidden to the user.
     * 
     * @param {object} e - The event API, check for explanation: https://reactnative.dev/docs/keyboard#addlistener
     */
    onKeyboardDidHide = () => {
        this.setKeyboardHeight(0)
    }

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

    /**
     * We update the state by reference, it means this might work like a blackBox for some people.
     * Reference: https://stackoverflow.com/questions/373419/whats-the-difference-between-passing-by-reference-vs-passing-by-value
     * When we pass the block data to the Block components below we pass a reference.
     * It means we pass the location in memory of this object and not a copy. That's exactly how `useRef()` hook
     * works. It bundles your values to an object. An object is always passed between functions as reference
     * and not as value.
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

        const checkIfLastPageBlockIsEmptyTextAndIfNotAddIt = () => {
            const lastBlockOfPage = this.state.data.rich_text_page_blocks[this.state.data.rich_text_page_blocks.length - 1]
            if (
                this.getBlockTypeNameById(lastBlockOfPage.block_type) !== 'text' || 
                lastBlockOfPage.rich_text_block_contents.length > 1 || 
                lastBlockOfPage.rich_text_block_contents[0] === undefined || 
                lastBlockOfPage.rich_text_block_contents[0].text !== ''
            ) {
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

        if (isFocus === true) {
            // the focus head prevents us from changing the focus too much, when too much onFocus is being fired at once
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
            // dismiss the block we update the state here.) Because of this
            makeDelay(() => {
                if (this.nextActiveBlock === null) {
                    update(activeBlock)
                }
            })
        } else {
            update(activeBlock)
        }      
    }

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

    /**
     * When the user is uploading a file we usually save a draft, a draft is a temporary file that will only be available
     * for a shor period of time.
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
            draftStringId = response.data.data.draft_id
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

    componentDidMount = () => {
        this._isMounted = true
        // When we create a new data rich text we automatically set the initial. 
        // because of this we need to propagate this new data to the parent.
        if (this.props.onStateChange) {
            this.props.onStateChange({...this.state.data})
        }
        if (process.env['APP'] !== 'web') {
            Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow)
            Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide)  
        }
    }

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

    componentWillUnmount = () => {
        this._isMounted = false
        if (process.env['APP'] !== 'web') {
            Keyboard.removeListener('keyboardDidShow', this.onKeyboardDidShow)
            Keyboard.removeListener('keyboardDidHide', this.onKeyboardDidHide)  
        }

        // Remove drafts, since we will not be using them anymore when unmounting this component
        const draftsToRemove = Object.keys(this.drafts)
        for (let i = 0; i < draftsToRemove.length; i++) {
            this.props.onRemoveDraft(draftsToRemove[i])
        }
    }

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

    renderMobile = () => {
        return (
            <RichTextContainer height={this.props.height} onLayout={(e) => this.setRichTextHeight(e.nativeEvent.layout.height)}>
                <RichTextBlocksContainer 
                ref={this.flatListRef}
                style={{
                    height: this.state.mobileKeyboardHeight !== 0 ? this.state.mobileRichTextHeight - this.state.mobileKeyboardHeight - 163 : this.state.mobileRichTextHeight
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
                        types={this.props.types}
                        blockTypeOptionsForSelection={this.props.types.rich_text.block_type}
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
                    {this.state.activeBlock !== this.toolbar.current.blockUUID && ![false, null, undefined].includes(this.props.isEditable) ? (
                        <Toolbar
                        isBlockActive={true}
                        {...this.getToolbarProps()}
                        />
                    ) : null}
                </KeyboardAvoidingView>

            </RichTextContainer>
        )
    }
    
    renderWeb = () => {
        return (
            <RichTextContainer className={'rich-text-container'} height={this.props.height}>
                {this.state.activeBlock !== null && this.props.isEditable !== false ? (
                    <Toolbar
                    width={this.state.webToolbarWidth}
                    isBlockActive={true}
                    {...this.getToolbarProps()}
                    />
                ) : ''}
                <RichTextBlocksContainer>
                    {this.state.data.rich_text_page_blocks.map((block, index) => (
                        <Block 
                        key={block.uuid} 
                        block={block} 
                        types={this.props.types}
                        pageId={this.state.data.id}
                        blockTypeOptionsForSelection={this.props.types.rich_text.block_type}
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

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ types: state.login.types }), actions)(RichText)