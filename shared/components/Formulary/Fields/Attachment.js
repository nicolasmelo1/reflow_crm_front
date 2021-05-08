import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Field from '../../../styles/Formulary/Field'
import Alert from '../../Utils/Alert'
import { strings } from '../../../utils/constants'
import base64 from '../../../utils/base64'
import agent from '../../../utils/agent'
import dynamicImport from '../../../utils/dynamicImport'
import Overlay from '../../../styles/Overlay'

const Spinner = dynamicImport('react-bootstrap', 'Spinner')

/**
 * Component responsible for holding each attachment file, a attachment file could be also a draft so be aware of this.
 * 
 * @param {*} props 
 */
const AttachmentFile = (props) => {
    const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false)
    const [fileUrl, setFileUrl] = useState(null)
    const sidebarToogleZindex = React.useRef(null)
    const isMountedRef = React.useRef(null)
    const itemValue = props.draftToFileReference[props.value.value] ? props.draftToFileReference[props.value.value] : props.value.value
    const splittedFullName = (itemValue) ? itemValue.split('.') : []
    const fileFormat = splittedFullName[splittedFullName.length-1]
    // ------------------------------------------------------------------------------------------
    /**
     * Function responsible for retriving if a certain value is a draft, so if the value is a string and it is
     * a base64 encoded string it could be a draft, if it has draft in it, then it's certainly a draft.
     * Otherwise it is not a draft
     * 
     * @param {String} value - Value to check if it as draft or not
     */
    const isDraft = (value) => {
        if (base64.isBase64(value)) {
            return base64.decode(value).includes('draft-')
        } else {
            return false
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Function responsible for handling when the user clicks a file, when the user clicks we can open the
     * preview of the photo if it is an image or we download it otherwise.
     * 
     * IMPORTANT: Notice that we need to change the toolbar toogle zIndex here, if we do not change the sidebar tooggle
     * will show on top of the image. Be aware that we need to store this value to set it again after closing
     */
    const onClick = () => {
        if ((['png', 'jpg', 'jpeg', 'gif'].includes(fileFormat))) {
            sidebarToogleZindex.current = document.querySelector('.sidebar-toogle').style.zIndex
            document.querySelector('.sidebar-toogle').style.zIndex = 0
            setIsFilePreviewOpen(!isFilePreviewOpen)
        } else if (![null, undefined, ''].includes(fileUrl)){
            window.open(fileUrl)
        }
        
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user closes the preview we set the zIndex of the sidebar toogle back to normal and also
     * closes the preview view.
     */
    const onClickClosePreview = () => {
        document.querySelector('.sidebar-toogle').style.zIndex = sidebarToogleZindex.current
        setIsFilePreviewOpen(!isFilePreviewOpen)
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (!['', null].includes(props.value.value)) {
            if (isDraft(props.value.value)) {
                agent.http.DRAFT.getDraftFile(props.value.value).then(url => {
                    if (isMountedRef.current) {
                        setFileUrl(url)
                    }
                })
            } else {
                props.getAttachmentUrl(props.field.id, props.value.value).then(url => {
                    if (isMountedRef.current) {
                        setFileUrl(url)
                    }
                })
            }
        }
    }, [props.value.value])
    /////////////////////////////////////////////////////////////////////////////////////////////
    //########################################################################################//
    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <Field.Attachment.ItemContainer>
                <Overlay
                text={itemValue}>
                    <Field.Attachment.Label
                    onClick={e=> {onClick()}} 
                    isSectionConditional={props.isSectionConditional}
                    >
                        <Field.Attachment.Image 
                        src={(['png', 'jpg', 'jpeg', 'gif'].includes(fileFormat)) ? fileUrl : `/${fileFormat}_icon.png`} 
                        isSectionConditional={props.isSectionConditional}
                        />
                        <Field.Attachment.Text>
                            {itemValue}
                        </Field.Attachment.Text>
                    </Field.Attachment.Label>
                </Overlay>
                <Field.Attachment.Button 
                onClick={e=> {props.removeFile()}}
                > 
                    <FontAwesomeIcon icon="trash"/> 
                </Field.Attachment.Button>
                <Field.Attachment.PreviewContainer isOpen={isFilePreviewOpen}>
                    <div>
                        <Field.Attachment.PreviewTopButtonsContainer>
                            <Field.Attachment.PreviewCloseButton 
                            onClick={(e) => onClickClosePreview()}
                            > 
                                <FontAwesomeIcon icon={'times'} style={{fontSize: '50px'}}/>
                            </Field.Attachment.PreviewCloseButton>
                        </Field.Attachment.PreviewTopButtonsContainer>
                        {isFilePreviewOpen ? (
                            <Field.Attachment.PreviewImageContainer>
                                <img src={fileUrl}/>
                            </Field.Attachment.PreviewImageContainer>
                        ) : ''}
                    </div> 
                </Field.Attachment.PreviewContainer>
            </Field.Attachment.ItemContainer>
        )
    }
    //########################################################################################//

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}


/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Attachment = (props) => {
    const [isUploading, setIsUploading] = useState()
    const [uploadedFileNames, setUploadedFileNames] = useState([])
    const [isDraggingOver, setIsDraggingOver] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    // ------------------------------------------------------------------------------------------
    /**
     * Just to prevent default and stop propagation of a particular event on the web.
     * 
     * @param {SyntheticEvent} event - The event to prevent the default behaviour.
     */
    const preventDefaultAndStopPropagationOfEventWeb = (event) => {
        if (process.env['APP'] === 'web') {
            event.preventDefault()
            event.stopPropagation()
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Add file to the draft
     * 
     * @param {File} file 
     */
    const addFile = async (files) => {     
        setIsUploading(true)   
        const promises = Array.from(files).map(async file => {
            const attachmentValues = props.values.map(value => value.value)
            const isNotAcceptedFile = uploadedFileNames.some(fileName => fileName === file.name) || props.values.some(value => value.value === file.name)
            if (!isNotAcceptedFile && props.onAddFile) {
                try {
                    const draftStringId = await props.onAddFile(file.name, props.field.id, file)
                    if (draftStringId !== '') {
                        const formValues = props.multipleValueFieldHelper(attachmentValues.concat(draftStringId))
                        uploadedFileNames.push(file.name)
                        props.setValues([...formValues])
                        setUploadedFileNames([...uploadedFileNames])

                    }
                }
                catch {}
            } else {
                setShowAlert(true)
            }
        })
        await Promise.all(promises)
        setIsUploading(false)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * remove a file based on its index
     * 
     * @param {BigInteger} indexToRemove 
     */
    const removeFile = (indexToRemove) => {
        const attachmentValues = props.values.map(value => value.value)
        let value = attachmentValues[indexToRemove]
        value = props.draftToFileReference[value] ? props.draftToFileReference[value] : value

        attachmentValues.splice(indexToRemove, 1)

        setUploadedFileNames(uploadedFileNames.filter(fileName => fileName !== value))
        const formValues = props.multipleValueFieldHelper(attachmentValues)
        props.setValues([...formValues])
    } 
    // ------------------------------------------------------------------------------------------
    //########################################################################################//
    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <Field.Attachment.Container 
            onDrag={e => preventDefaultAndStopPropagationOfEventWeb(e)} 
            onDragOver={e=> {
                preventDefaultAndStopPropagationOfEventWeb(e)
                setIsDraggingOver(true)
            }} 
            onDragEnd={(e) => {
                preventDefaultAndStopPropagationOfEventWeb(e)
                setIsDraggingOver(false)
            }} 
            onDragLeave={(e) => {
                preventDefaultAndStopPropagationOfEventWeb(e)
                setIsDraggingOver(false)
            }} 
            onDrop={e=> {
                preventDefaultAndStopPropagationOfEventWeb(e)
                setIsDraggingOver(false)
                addFile(e.dataTransfer.files)
            }}
            >
                <Alert 
                alertTitle={strings['pt-br']['formularyFieldAttachmentAlertTitle']} 
                alertMessage={strings['pt-br']['formularyFieldAttachmentAlertContent']} 
                show={showAlert} 
                onHide={() => {
                    setShowAlert(false)
                }} 
                />
                <Field.Attachment.ScrollContainer
                isSectionConditional={props.isSectionConditional} 
                >
                    {isUploading ? (
                        <Field.Attachment.LoadingContainer>
                            <Spinner animation="border"/>
                        </Field.Attachment.LoadingContainer>
                    ) : (
                        <React.Fragment>
                            <Field.Attachment.AddNewFileButtonContainer 
                            isInitial={true}
                            hasValues={!isDraggingOver ? props.values.length !== 0 : false} 
                            isSectionConditional={props.isSectionConditional} 
                            isDragging={isDraggingOver}
                            >
                                <Field.Attachment.Label isInitial={true} 
                                isSectionConditional={props.isSectionConditional}
                                >
                                    <Field.Attachment.Image isInitial={true} 
                                    src={(isDraggingOver) ? "/drop_icon.png" : "/add_icon.png"} 
                                    isSectionConditional={props.isSectionConditional}/>
                                    <Field.Attachment.Text isInitial={true}>
                                        {(isDraggingOver) ? strings['pt-br']['formularyFieldAttachmentDropTheFilesLabel'] : strings['pt-br']['formularyFieldAttachmentDefaultLabel']}
                                    </Field.Attachment.Text>
                                    <Field.Attachment.Input type="file" 
                                    onChange={e => {        
                                        e.preventDefault()
                                        addFile(e.target.files) 
                                        e.target.value = null
                                    }}
                                    />
                                </Field.Attachment.Label>
                            </Field.Attachment.AddNewFileButtonContainer>
                            {!isDraggingOver ? props.values.map((value, index) => (
                                <AttachmentFile
                                key={value.value}
                                formName={props.formName}
                                removeFieldFile={props.removeFieldFile}
                                multipleValueFieldHelper={props.multipleValueFieldHelper}
                                sectionId={props.sectionId}
                                draftToFileReference={props.draftToFileReference}
                                field={props.field}
                                isSectionConditional={props.isSectionConditional} 
                                value={value}
                                getAttachmentUrl={props.getAttachmentUrl}
                                removeFile={() => removeFile(index)}
                                />
                            )) : null}
                        </React.Fragment>
                    )}

                </Field.Attachment.ScrollContainer>
            </Field.Attachment.Container>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Attachment