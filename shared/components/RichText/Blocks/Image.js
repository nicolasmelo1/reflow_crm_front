import React, { useState, useEffect } from 'react'
import axios from 'axios'
import agent from '../../../utils/agent'
import { strings } from '../../../utils/constants'
import { View } from 'react-native'
import {
    BlockImageButton,
    BlockImageSelectContainer,
    BlockImageSelectImageContainer,
    BlockImageSelectImageButton,
    BlockImageImageButton,
    BlockImageSelectImageTypeButton
} from '../../../styles/RichText'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Image = (props) => {
    const activeBlockRef = React.useRef(null)
    const isMountedRef = React.useRef(false)
    const imageRef = React.useRef(null)
    const imageFileRef = React.useRef(null)
    const imageBlockRef = React.useRef(null)
    const draftStringIdRef = React.useRef(null)
    const sourceRef = React.useRef(null)
    const isResizingRef = React.useRef(0)
    const sizeRelativeToViewRef = React.useRef(0)
    const [isMouseOver, setIsMouseOver] = useState(false)
    const [sizeRelativeToView, _setSizeRelativeToView] = useState(0)
    const [activeImageType, setActiveImageType] = useState({
        imageFile: true,
        imageLink: false
    })
    const [imageUrl, setImageUrl] = useState(null)
    const setSizeRelativeToView = (data) => {
        sizeRelativeToViewRef.current = data
        _setSizeRelativeToView(data)
    }

    /**
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
     * the state changes that you need. (for example, here we are listening for changes in props and stateOfSelection, every other state
     * change is irrelevant. When any of this states changes we want the toolbar to update accordingly.)
     */
    const addToolbar = () => {
        if (props.addToolbar) {      
            props.toolbarProps.blockUUID = props.block.uuid
            props.addToolbar({...props.toolbarProps})
        }
    }

    /**
     * Each block has it's own options, the options of the image block are like the following.
     */
    const imageOptions = () => {
        return {
            id: null,
            link: null,
            size_relative_to_view: 1,
            file_name: null
        }
    }

    /**
     * When the user clicks anywhere outside of the block container we dismiss the container that displays the button for the user
     * to select the image in his computer.
     * 
     * @param {Object} e - The event emitted by the browser when `onmousedown` is fired
     */
    const onMouseDownWeb = (e) => {
        if (imageBlockRef.current && !imageBlockRef.current.contains(e.target) && props.block.uuid === activeBlockRef.current) {
            props.updateBlocks(null)
        }
    }

    /**
     * WORKS ONLY ON WEB
     * 
     * When the user stops clicking on the mouse anywhere on the document we propagate the changes to 
     * the block. We do this to prevent many updates on the hole page tree data all of the time. We just propagate
     * the changes when the user finishes editing.
     */
    const onMouseUpResizing = () => {
        isResizingRef.current = 0
        props.block.image_option.size_relative_to_view = sizeRelativeToViewRef.current 
        props.updateBlocks(props.block.uuid)
    }
    
    /**
     * WORKS ONLY ON WEB
     * 
     * While the user is holding the click and dragging we resize the image in the order of 0.01 per 0.01. The calculation is as follows:
     * 
     * > To shrink we need to move the mouse closer to the center.
     *      If the mouse is on the LEFT of the center of the page. The difference between the LAST position of the mouse and the NEW position of the mouse
     * should be a negative number.
     *      If the mouse is on the RIGHT of the center of the page. The difference between the LAST position of the mouse and the NEW position of the mouse
     * should be a positive number.
     * 
     * > To expand we need to move the mouse outer of the center.
     *      If the mouse is on the LEFT of the center of the page. The difference between the LAST position of the mouse and the NEW position of the mouse
     * should be a positive number.
     *      If the mouse is on the RIGHT of the center of the page. The difference between the LAST position of the mouse and the NEW position of the mouse
     * should be a negative number.
     * 
     * @param {Event} e - The event recived by the "mousemove" event by the browser.
     */
    const onMouseMoveResizing = (e) => {
        if (isResizingRef.current !== 0) {
            const centerOfScreen = window.innerWidth/2
            if ((e.pageX < centerOfScreen && e.pageX - isResizingRef.current > 0) || (e.pageX > centerOfScreen && e.pageX - isResizingRef.current < 0)) {
                if (sizeRelativeToViewRef.current  > 0.1) {
                    isResizingRef.current = e.pageX
                    setSizeRelativeToView(parseFloat(sizeRelativeToViewRef.current ) - 0.01)
                } 
            } else if ((e.pageX < centerOfScreen && e.pageX - isResizingRef.current < 0) || (e.pageX > centerOfScreen && e.pageX - isResizingRef.current > 0)) {
                if (sizeRelativeToViewRef.current  <= 1) {
                    isResizingRef.current = e.pageX
                    setSizeRelativeToView(parseFloat(sizeRelativeToViewRef.current ) + 0.01)
                }
            }
        }
    }

    /**
     * When the user adds a new file what we do is save a draft so when the user saves this edition it becomes a lot easier and faster
     * to save the file, since we will not need to upload everything at once.
     * 
     * @param {FilesList<Blob>} files - This are the files of the input, we can only have one per input so we only use the first one.
     */
    const onUploadFile = (files) => {
        imageFileRef.current = files[0]
        props.onCreateDraft(sourceRef.current, imageFileRef.current).then(async response => {
            if (response && response.status === 200) {
                props.block.image_option.file_name = response.data.data.draft_id
                draftStringIdRef.current = response.data.data.draft_id
                const imageUrl = await agent.http.DRAFT.getDraftFile(response.data.data.draft_id)
                setImageUrl(imageUrl)
                
                agent.websocket.DRAFT.recieveFileRemoved({
                    blockId: props.block.uuid,
                    callback: (data) => {
                        if (isMountedRef.current && data.data.draft_string_id === draftStringIdRef.current) {
                            onUploadFile([imageFileRef.current])
                        }
                    }
                })

                props.updateBlocks(props.block.uuid)
            }
        })
    }

    /**
     * Handles when the user uses a link to the image instead of an image file
     * 
     * @param {String} link - An http url as string
     */
    const onAddLink = (link) => {
        props.block.image_option.link = link
        setImageUrl(link)
        props.updateBlocks(props.block.uuid)

    }

    /**
     * This function is used when the component is mounted. when the component is mounted and we have a `link`
     * or a `file_name` defined we add a new image link to the component so the image is loaded.
     */
    const addImageUrlOnMount = async () => {
        if (props.block.image_option.link !== null) {
            setImageUrl(props.block.image_option.link)
        } else if (props.block.image_option.file_name !== null) {
            const url = await agent.http.RICH_TEXT.getRichTextImageBlockFile(
                props.pageId,
                props.block.uuid,
                props.block.image_option.file_name
            )
            if (isMountedRef.current) {
                setImageUrl(url)
            }
        }
    }

    /**
     * This is used when the component is mounted. What we do is check if the component is mounted 
     * and if it has the image_option parameter defined, if not we define it.
     */
    const checkIfImageOptionsAndInsertIt = () => {
        if (props.block.image_option === null) {
            props.block.image_option = imageOptions()
        }
    }

    useEffect(() => {
        isMountedRef.current = true
        if (process.env['APP'] === 'web') {
            document.addEventListener("mousedown", onMouseDownWeb)
            document.addEventListener("mousemove", onMouseMoveResizing)
            document.addEventListener("mouseup", onMouseUpResizing)
        }
        checkIfImageOptionsAndInsertIt()
        addImageUrlOnMount()
        setSizeRelativeToView(parseFloat(props.block?.image_option?.size_relative_to_view || 1.00))

        sourceRef.current = axios.CancelToken.source()

        if (![null, undefined].includes(props.imageFile)) {
            onUploadFile([props.imageFile])
        }

        return () => {
            isMountedRef.current = false
            if (process.env['APP'] === 'web') {
                document.removeEventListener("mousedown", onMouseDownWeb)
                document.removeEventListener("mouseup", onMouseUpResizing)
                document.removeEventListener("mousemove", onMouseMoveResizing)
            }

            if (draftStringIdRef.current !== null) {
                props.onRemoveDraft(draftStringIdRef.current)
            }
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    useEffect(() => {
        addToolbar()
        activeBlockRef.current = props.activeBlock
    }, [props.activeBlock])
    
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div ref={imageBlockRef}>
                {imageUrl === null ? (
                    <BlockImageButton 
                    onClick={(e) => {props.isEditable ? props.updateBlocks(props.block.uuid) : null}}
                    >
                        {strings['pt-br']['richTextImageBlockButtonLabel']}
                    </BlockImageButton>
                ) : (
                    <BlockImageImageButton 
                    onMouseEnter={(e) => setIsMouseOver(true)} 
                    onMouseLeave={(e) => setIsMouseOver(false)}
                    onClick={(e) => {props.isEditable ? props.updateBlocks(props.block.uuid) : null}}
                    >   
                        <div style={{ position: 'relative', width: `${sizeRelativeToView*100}%`}}>

                            {isMouseOver ? (
                                <div style={{ width: `100%`, height: '100%', position: 'absolute', backgroundColor: '#00000020', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10}}>
                                    <button 
                                    onMouseDown={(e) => {isResizingRef.current = e.pageX}}
                                    style={{height: '40px', backgroundColor: '#000', width: '5px',  border: '1px solid #f2f2f2', margin: '5px', borderRadius: '20px', padding: 0, cursor: 'col-resize'}}></button>
                                    <button 
                                    onMouseDown={(e) => {isResizingRef.current = e.pageX}}
                                    style={{height: '40px', backgroundColor: '#000', width: '5px', border: '1px solid #f2f2f2', margin: '5px', borderRadius: '20px', padding: 0, cursor: 'col-resize'}} ></button>
                                </div>
                            ) : ''}
                            <img ref={imageRef} src={imageUrl}/>
                        </div>

                    </BlockImageImageButton>
                )}
                {props.block.uuid === props.activeBlock && imageUrl === null ? (
                    <BlockImageSelectContainer>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <BlockImageSelectImageTypeButton 
                            isSelected={activeImageType.imageFile}
                            onClick={(e) => setActiveImageType({imageFile:true, imageLink: false})}
                            >
                                {strings['pt-br']['richTextImageBlockSelectFileTypeButtonLabel']}
                            </BlockImageSelectImageTypeButton>
                            <BlockImageSelectImageTypeButton 
                            isSelected={activeImageType.imageLink}
                            onClick={(e) => setActiveImageType({imageFile:false, imageLink: true})}
                            >
                                {strings['pt-br']['richTextImageBlockSelectLinkTypeButtonLabel']}
                            </BlockImageSelectImageTypeButton>
                        </div>
                        <BlockImageSelectImageContainer>
                            {activeImageType.imageFile ? (
                                <BlockImageSelectImageButton>
                                    {strings['pt-br']['richTextImageBlockSelectImagesButtonLabel']}
                                    <input type={'file'} style={{ display: 'none' }} accept={'image/*'} onChange={(e) => onUploadFile(e.target.files)}/>
                                </BlockImageSelectImageButton>
                            ) : (
                                <input 
                                type={'text'} 
                                style={{ width: '95%'}} 
                                onChange={(e)=> {onAddLink(e.target.value)}} 
                                placeholder={strings['pt-br']['richTextImageBlockSelectLinkTypePlaceholder']}
                                />
                            )}
                        </BlockImageSelectImageContainer>
                    </BlockImageSelectContainer>
                ) : ''}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Image