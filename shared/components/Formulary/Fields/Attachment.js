import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Field from '../../../styles/Formulary/Field'
import Alert from '../../Utils/Alert'
import { strings } from '../../../utils/constants'
import agent from '../../../utils/agent'


const AttachmentFile = (props) => {
    const itemValue = props.draftToFileReference[props.value.value] ? props.draftToFileReference[props.value.value] : props.value.value
    const splittedFullName = (itemValue) ? itemValue.split('.') : []
    const fileFormat = splittedFullName[splittedFullName.length-1]

    const onClick = () => {
        /**  if (![null, undefined, ''].includes(props.value.id)){
            window.open(await agent.http.FORMULARY.getAttachmentFile(props.formName, props.sectionId, props.field.id, props.value.value))
        }*/
        
    }

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <Field.Attachment.ItemContainer>
                <Field.Attachment.Label
                 onClick={e=> {onClick()}} 
                 isSectionConditional={props.isSectionConditional}
                 >
                    <Field.Attachment.Image 
                    src={(props.isInitial) ? "/add_icon.png" : `/${fileFormat}_icon.png`} 
                    isSectionConditional={props.isSectionConditional}
                    />
                    <Field.Attachment.Text 
                    isInitial={props.isInitial}
                    >
                        {itemValue}
                    </Field.Attachment.Text>
                </Field.Attachment.Label>
                <Field.Attachment.Button onClick={e=> {props.removeFile()}}> 
                    <FontAwesomeIcon icon="trash"/> 
                </Field.Attachment.Button>
            </Field.Attachment.ItemContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Attachment = (props) => {
    const [uploadedFileNames, setUploadedFileNames] = useState([])
    const [isDraggingOver, setIsDraggingOver] = useState(false)
    const [showAlert, setShowAlert] = useState(false)

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

    /**
     * Add file to the draft
     * 
     * @param {File} file 
     */
    const addFile = async (file) => {        
        const attachmentValues = props.values.map(value => value.value)
        const isNotAcceptedFile = uploadedFileNames.some(fileName => fileName === file.name) || props.values.some(value => value.value === file.name)
        
        if (!isNotAcceptedFile) {
            const draftStringId = await props.onAddFile(file)
            const formValues = props.multipleValueFieldHelper(attachmentValues.concat(draftStringId))
            uploadedFileNames.push(file.name)
            props.setValues([...formValues])
            setUploadedFileNames([...uploadedFileNames])
        } else {
            setShowAlert(true)
        }
    }

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

    useEffect(() => {

    }, [props.draftToFileReference])
    
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

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
                addFile(e.dataTransfer.files[0])
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
                {isDraggingOver ? (
                    <div>
                        <p>
                            {'Solte os arquivos aqui'}
                        </p>
                    </div>
                ) : (
                    <Field.Attachment.ScrollContainer>
                        <Field.Attachment.AddNewFileButtonContainer 
                        isInitial={true}
                        hasValues={props.values.length !== 0} 
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
                                    {(isDraggingOver) ? 'Solte os arquivos aqui.' : strings['pt-br']['formularyFieldAttachmentDefaultLabel']}
                                </Field.Attachment.Text>
                                <Field.Attachment.Input type="file" 
                                onChange={e => {        
                                    e.preventDefault()
                                    addFile(e.target.files[0]) 
                                    e.target.value = null
                                }}
                                />
                            </Field.Attachment.Label>
                        </Field.Attachment.AddNewFileButtonContainer>
                        {props.values.map((value, index) => (
                            <AttachmentFile
                            key={value.value}
                            removeFieldFile={props.removeFieldFile}
                            multipleValueFieldHelper={props.multipleValueFieldHelper}
                            sectionId={props.sectionId}
                            draftToFileReference={props.draftToFileReference}
                            field={props.field}
                            isSectionConditional={props.isSectionConditional} 
                            value={value}
                            removeFile={() => removeFile(index)}
                            />
                        ))}
                    </Field.Attachment.ScrollContainer>
                )}
            </Field.Attachment.Container>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Attachment