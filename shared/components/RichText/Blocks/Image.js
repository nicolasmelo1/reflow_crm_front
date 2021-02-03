import React, { useState, useEffect } from 'react'
import generateUUID from '../../../utils/generateUUID'
import agent from '../../../utils/agent'
import base64 from '../../../utils/base64'
import dynamicImport from '../../../utils/dynamicImport'
import { strings } from '../../../utils/constants'
import { Modal, SafeAreaView, View, Text, TextInput, ActivityIndicator, Image } from 'react-native'
import {
    BlockImageButton,
    BlockImageSelectContainer,
    BlockImageSelectImageContainer,
    BlockImageSelectImageButton,
    BlockImageImageButton,
    BlockImageSelectImageTypeButton,
    BlockImageResizeButton,
    BlockImageResizeContainer
} from '../../../styles/RichText'

const ImagePicker = dynamicImport('expo-image-picker', '')
const Permissions = dynamicImport('expo-permissions', '')

/**
 * The image block is simple in its core idea but how we handle images in the rich text can be kind difficult.
 * 
 * Usually, to upload a file to the backend what we do is encode the request on a formEncoded data, send the json 
 * as a string and then, on the backend convert this json stringfied back to json and then we get all of the files 
 * uploaded and do something.
 * 
 * The problem is: every file should be sent at once on a single request. Sure, this can work for small files and small 
 * text but this can become a problem when a page becomes huge and with many files. So to prevent this from happening
 * we have created something called `drafts` in our backend, it's a hole new domain for our app. And the idea of this domain
 * is to hold temporary files. Temporary because they are deleted after some time. So when the user adds an image
 * we upload a draft, and then when we actually save the draft we just copy the contents from one place to another on the backend
 * but since this is a backend process, it takes a lot less time than if it was done in the front end.
 * 
 * As i said, drafts are temporary, so you need to make sure that if your draft was removed and the rich text is still
 * open, you need to reupload it to guarantee that it will exist when saving.
 * 
 * Besides that, this just holds an image that is centered in the block and that can be resizeble, nothing much.
 * 
 * @param {Object} props - {... all of the props defined in the Block and Text components}
 */
const ImageBlock = (props) => {
    const activeBlockRef = React.useRef(null)
    const isMountedRef = React.useRef(false)
    const imageUrlRef = React.useRef(null)
    const imageBlockRef = React.useRef(null)
    const resizingRef = React.useRef({
        pageX: null,
        isLeftButton: null,
        isRightButton: null
    })
    const sizeRelativeToViewRef = React.useRef(0)
    const [isUploading, setIsUploading] = useState(false)
    const [isMouseOver, setIsMouseOver] = useState(false)
    const [sizeRelativeToView, _setSizeRelativeToView] = useState(0)
    const [activeImageType, setActiveImageType] = useState({
        imageFile: true,
        imageLink: false
    })
    const [imageUrl, _setImageUrl] = useState(null)

    const setImageUrl = (data) => {
        imageUrlRef.current = data
        _setImageUrl(data)
    }

    const setSizeRelativeToView = (data) => {
        sizeRelativeToViewRef.current = data
        _setSizeRelativeToView(data)
    }

    /**
     * Each block has it's own options, the options of the image block are like the following.
     */
    const imageOptions = () => {
        return {
            id: null,
            link: null,
            file_image_uuid: generateUUID(),
            size_relative_to_view: 1,
            file_name: null
        }
    }

    /**
     * Ask permission to access the camera roll
     * You can see it here: https://docs.expo.io/versions/latest/sdk/imagepicker/
     */
    const getPermissionAsyncMobile = async () => {
        if (Platform.OS !== 'web' && process.env['APP'] !== 'web') {
            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!')
            }
        }
    }
    
    const pickImageOnMobile = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })
            if (!result.cancelled) {
                return result.uri
            }
            return null
        } catch (E) {
            return null
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
        if (resizingRef.current.pageX !== null && (resizingRef.current.isLeftButton !== null || resizingRef.current.isRightButton !== null)) {
            resizingRef.current = {
                pageX: null,
                isLeftButton: null,
                isRightButton: null
            }
            props.block.image_option.size_relative_to_view = sizeRelativeToViewRef.current 
            props.updateBlocks(props.block.uuid)
        }
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
        if (resizingRef.current.pageX !== null && (resizingRef.current.isLeftButton !== null || resizingRef.current.isRightButton !== null)) {
            if ((resizingRef.current.isLeftButton && e.pageX > resizingRef.current.pageX) || (resizingRef.current.isRightButton && e.pageX < resizingRef.current.pageX)) {
                if (sizeRelativeToViewRef.current > 0.1) {
                    resizingRef.current.pageX = e.pageX
                    setSizeRelativeToView(parseFloat(sizeRelativeToViewRef.current) - 0.01)
                } 
            } else if ((resizingRef.current.isLeftButton && e.pageX < resizingRef.current.pageX) || (resizingRef.current.isRightButton && e.pageX > resizingRef.current.pageX)) {
                if (sizeRelativeToViewRef.current <= 1) {
                    resizingRef.current.pageX = e.pageX
                    setSizeRelativeToView(parseFloat(sizeRelativeToViewRef.current) + 0.01)
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
        let file = null
        if (process.env['APP'] !== 'web') {
            const filename = files[0].split('/').pop()
            const match = /\.(\w+)$/.exec(filename)
            const type = match ? `image/${match[1]}` : `image`
            file = { uri: files[0], name: filename, type }
        } else {
            file = files[0]
        }
        setIsUploading(true)
        props.onUploadFileToDraft(file).then(async draftStringId => {
            props.block.image_option.file_name = draftStringId
            const imageUrl = await agent.http.DRAFT.getDraftFile(draftStringId)
            setImageUrl(imageUrl)
            props.updateBlocks(props.block.uuid)
            setIsUploading(false)
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
     * 
     * IMPORTANT: Be aware of the conditions, if we just check if it has a file_name if the `file_name` is a draft
     * we will change the url to get the image from the rich_text itself and not the draft, which is wrong. 
     * This was causing a lot of issues in development because it was causing the server to hang whenever we made changes in this file.
     * This was caused because when you make a Fast Refresh the `useEffect` hook runs (it unmounts the component and then mounts again).
     * Since we run this function when the component is mounted this error was being caused.
     * 
     * To prevent this from happening we decode the file_name, if it is a base64 string with `draft-` in it it's almost definetly a draft, 
     * otherwise it's probably not a draft.
     */
    const addImageUrlOnMount = () => {
        if (props.block.image_option.link !== null) {
            setImageUrl(props.block.image_option.link)
        } else if (props.block.image_option.file_name !== null) {
            try {
                const fileName = base64.decode(props.block.image_option.file_name)
                if (fileName.includes('draft-')) {
                    agent.http.DRAFT.getDraftFile(props.block.image_option.file_name).then(url => {
                        if (isMountedRef.current) {
                            setImageUrl(url)
                        }
                    })
                }
            } catch {
                if (props.pageId !== null) {
                    agent.http.RICH_TEXT.getRichTextImageBlockFile(
                        props.pageId,
                        props.block.image_option.file_image_uuid
                    ).then(url => {
                        if (isMountedRef.current) {
                            setImageUrl(url)
                        }
                    })
                }
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
        getPermissionAsyncMobile()
        checkIfImageOptionsAndInsertIt()
        addImageUrlOnMount()
        setSizeRelativeToView(parseFloat(props.block?.image_option?.size_relative_to_view || 1.00))
        
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
        }
    }, [])

    useEffect(() => {
        props.addToolbar()
        activeBlockRef.current = props.activeBlock
    }, [props.activeBlock])
    
    useEffect(() => {
        // When we duplicate a file, like an image or a attachment, whatever. We actually create a new reference for the same object (not literally)
        // So what this means is, when we upload a file we create a draft in our database, and when we duplicate this image or file we are creating
        // a new reference for the same draft that was created before. What happens is, drafts are temporary, so we need to reupload them again
        // if they still exist. When a new draft is uploaded a new draft_string_id is issued, the children then also updates its draftStringId
        if (props.draftMapHeap[props.block.image_option.file_name] && props.draftMapHeap[props.block.image_option.file_name] !== props.block.image_option.file_name) {
            props.block.image_option.file_name = props.draftMapHeap[props.block.image_option.file_name]
            props.updateBlocks(props.activeBlock)
        }
    }, [props.draftMapHeap])

    const renderMobile = () => {
        return (
            <View>
                {imageUrl === null ? (
                    <View>
                        <BlockImageButton 
                        onPress={(e) => {props.isEditable ? props.updateBlocks(props.block.uuid) : null}}
                        >
                            <Text>
                                {strings['pt-br']['richTextImageBlockButtonLabel']}
                            </Text>
                        </BlockImageButton>
                        {props.block.uuid === props.activeBlock && imageUrl === null ? (
                            <Modal>
                                <SafeAreaView>
                                    <BlockImageSelectContainer>
                                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                                            <BlockImageSelectImageTypeButton 
                                            isSelected={activeImageType.imageFile}
                                            onPress={(e) => setActiveImageType({imageFile:true, imageLink: false})}
                                            >
                                                <Text style={{color: activeImageType.imageFile ? '#0dbf7e': '#17242D'}}>
                                                    {strings['pt-br']['richTextImageBlockSelectFileTypeButtonLabel']}
                                                </Text>
                                            </BlockImageSelectImageTypeButton>
                                            <BlockImageSelectImageTypeButton 
                                            isSelected={activeImageType.imageLink}
                                            onPress={(e) => setActiveImageType({imageFile:false, imageLink: true})}
                                            >
                                                <Text style={{color: activeImageType.imageLink ? '#0dbf7e': '#17242D'}}>
                                                    {strings['pt-br']['richTextImageBlockSelectLinkTypeButtonLabel']}
                                                </Text>
                                            </BlockImageSelectImageTypeButton>
                                        </View>
                                        <BlockImageSelectImageContainer>
                                        {activeImageType.imageFile ? (
                                            <View>
                                                {isUploading ? (
                                                    <ActivityIndicator size={'large'} color={'#0dbf7e'}/>
                                                ) : (
                                                    <BlockImageSelectImageButton onPress={(e) => pickImageOnMobile().then(file => file ? onUploadFile([file]) : null)}>
                                                        <Text>
                                                            {strings['pt-br']['richTextImageBlockSelectImagesButtonLabel']}
                                                        </Text>
                                                    </BlockImageSelectImageButton>
                                                )}
                                            </View>
                                        ) : (
                                            <TextInput 
                                            style={{ width: '100%', padding: 10, backgroundColor: '#f2f2f2'}} 
                                            onChange={(e)=> {onAddLink(e.target.value)}} 
                                            placeholder={strings['pt-br']['richTextImageBlockSelectLinkTypePlaceholder']}
                                            />
                                        )}
                                        </BlockImageSelectImageContainer>
                                    </BlockImageSelectContainer>
                                </SafeAreaView>
                            </Modal>
                        ) : null}
                    </View>
                ) : (
                    <BlockImageImageButton 
                    onPress={(e) => {props.isEditable ? props.updateBlocks(props.block.uuid) : null}}
                    >
                        <Image style={{ width: '100%', height: 200 }} source={{
                            uri: imageUrl
                        }}/>
                    </BlockImageImageButton>
                )}
            </View>
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
                                <BlockImageResizeContainer>
                                    <BlockImageResizeButton 
                                    onMouseDown={(e) => {resizingRef.current = {pageX: e.pageX, isLeftButton: true, isRightButton: null}}}
                                    />
                                    <BlockImageResizeButton 
                                    onMouseDown={(e) => {resizingRef.current = {pageX: e.pageX, isLeftButton: null, isRightButton: true}}}
                                    />
                                </BlockImageResizeContainer>
                            ) : ''}
                            <img src={imageUrl}/>
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

export default ImageBlock