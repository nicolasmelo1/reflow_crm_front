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
    const imageBlockRef = React.useRef(null)
    const [imageUrl, setImageUrl] = useState(null)

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
        if (!imageBlockRef.current.contains(e.target)) {
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
        props.onCreateDraft(files[0]).then(async response => {
            if (response && response.status === 200) {
                props.block.image_option.file_name = response.data.data.draft_id
                setImageUrl(await agent.http.DRAFT.getDraftFile(response.data.data.draft_id))
                //setImageDraftId(response.data.data.draft_id)
                props.updateBlocks(props.block.uuid)
            }
        })
    }

    const addImageUrlOnMount = async () => {
        if (props.block.image_option.link !== null) {
            setImageUrl(props.block.image_option.link)
        } else if (props.block.image_option.file_name !== null) {
            const url = await agent.http.RICH_TEXT.getRichTextImageBlockFile(
                props.pageId,
                props.block.uuid,
                props.block.image_option.file_name
            )
            setImageUrl(url)
        }
    }

    const checkIfImageOptionsAndInsertIt = () => {
        if (props.block.image_option === null) {
            props.block.image_option = imageOptions()
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", onMouseDownWeb)
        checkIfImageOptionsAndInsertIt()
        addImageUrlOnMount()
        return () => {
            document.removeEventListener("mousedown", onMouseDownWeb)
        }
    }, [])

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