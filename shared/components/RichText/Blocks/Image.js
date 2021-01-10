import React, { useState, useEffect } from 'react'
import agent from '../../../utils/agent'
import { strings } from '../../../utils/constants'
import Toolbar from '../Toolbar'
import { View } from 'react-native'
import {
    BlockImageButton,
    BlockImageSelectImageContainer,
    BlockImageSelectImageButton,
    BlockImageImageButton
} from '../../../styles/RichText'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Image = (props) => {
    const activeBlockRef = React.useRef(null)
    const isMountedRef = React.useRef(false)
    const imageFileRef = React.useRef(null)
    const imageBlockRef = React.useRef(null)
    const draftStringIdRef = React.useRef(null)
    const [imageUrl, setImageUrl] = useState(null)

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
        if (!imageBlockRef.current.contains(e.target) && props.block.uuid === activeBlockRef.current) {
            props.updateBlocks(null)
        }
    }

    /**
     * When the user adds a new file what we do is save a draft so when the user saves this edition it becomes a lot easier and faster
     * to save the file, since we will not need to upload everything at once.
     * 
     * @param {FilesList<Blob>} files - This are the files of the input, we can only have one per input so we only use the first one.
     */
    const onUploadFile = (files) => {
        console.log('teste')
        imageFileRef.current = files[0]
        props.onCreateDraft(imageFileRef.current).then(async response => {
            if (response && response.status === 200) {
                props.block.image_option.file_name = response.data.data.draft_id
                draftStringIdRef.current = response.data.data.draft_id
                setImageUrl(await agent.http.DRAFT.getDraftFile(response.data.data.draft_id))
                props.updateBlocks(props.block.uuid)
            }
        })
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
        document.addEventListener("mousedown", onMouseDownWeb)
        checkIfImageOptionsAndInsertIt()
        addImageUrlOnMount()
        return () => {
            isMountedRef.current = false
            document.removeEventListener("mousedown", onMouseDownWeb)
            
            if (draftStringIdRef.current !== null) {
                props.onRemoveDraft(draftStringIdRef.current)
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
                    onClick={(e) => {props.isEditable ? props.updateBlocks(props.block.uuid) : null}}
                    >
                        <img src={imageUrl}/>
                    </BlockImageImageButton>
                )}
                {props.block.uuid === props.activeBlock && imageUrl === null ? (
                    <BlockImageSelectImageContainer>
                        <BlockImageSelectImageButton>
                            {'Selecionar arquivo'}
                            <input type={'file'} style={{ display: 'none' }} accept={'image/*'} onChange={(e) => onUploadFile(e.target.files)}/>
                        </BlockImageSelectImageButton>
                    </BlockImageSelectImageContainer>
                ) : ''}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Image