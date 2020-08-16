import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Field from '../../../styles/Formulary/Field'
import Alert from '../../Utils/Alert'
import { strings } from '../../../utils/constants'
import agent from '../../../utils/agent'


const AttachmentItem = (props) => {
    const router = useRouter()

    const onClick = async () => {
        if (![null, undefined, ''].includes(props.value.id)){
            window.open(await agent.http.FORMULARY.getAttachmentFile(router.query.form, props.sectionId, props.field.id, props.value.value))
        }
    }
    const splittedFullName = (props.value) ? props.value.value.split('.') : []
    const fileFormat = splittedFullName[splittedFullName.length-1]

    return (
        <Field.Attachment.ItemContainer 
        isInitial={props.isInitial} 
        numberOfItems={props.numberOfItems} 
        isSectionConditional={props.isSectionConditional} 
        isDragging={props.isDragging}
        >
            {props.isInitial ? (
                <Field.Attachment.Label isInitial={props.isInitial} isSectionConditional={props.isSectionConditional}>
                    <Field.Attachment.Image isInitial={props.isInitial} src={(props.isDragging) ? "/drop_icon.png" : "/add_icon.png"} isSectionConditional={props.isSectionConditional}/>
                    <Field.Attachment.Text isInitial={props.isInitial}>{(props.isDragging) ? 'Solte os arquivos aqui.' : strings['pt-br']['formularyFieldAttachmentDefaultLabel']}</Field.Attachment.Text>
                    <Field.Attachment.Input type="file" 
                    onChange={e => {         
                        e.preventDefault();
                        props.addFile(e.target.files) 
                    }}
                    />
                </Field.Attachment.Label>
            ) : (
                <Field.Attachment.Label isInitial={props.isInitial} onClick={e=> {onClick()}} isSectionConditional={props.isSectionConditional}>
                    <Field.Attachment.Image isInitial={props.isInitial} src={(props.isInitial) ? "/add_icon.png" : `/${fileFormat}_icon.png`} isSectionConditional={props.isSectionConditional}/>
                    <Field.Attachment.Text isInitial={props.isInitial}>{props.value.value}</Field.Attachment.Text>
                </Field.Attachment.Label>
            )}
            {(props.removeFile) ? (
                <Field.Attachment.Button onClick={e=> {props.removeFile(e, props.value.value)}}> 
                    <FontAwesomeIcon icon="trash"/> 
                </Field.Attachment.Button>
            ): ''}
        </Field.Attachment.ItemContainer>
    )
}

const Attachment = (props) => {
    const initialInputProps = { 
        isInitial: true, 
        addFile: addFile
    }
    const [showAlert, setShowAlert] = useState(false)
    const [inputsProps, setInputsProps] = useState([initialInputProps])
    const [isDraggingOver, setIsDraggingOver] = useState(false)

    // check Select Component in components/Utils
    const valuesRef = React.useRef(props.values);
    const _setValues = data => {
        valuesRef.current = data;
        props.setValues(data);
    };

    const createInputProps = (value) => {
        const inputProps = { 
            initial: false,
            value: value,
            sectionId: props.sectionId,
            field: props.field,
            removeFile: removeFile
        }
        return inputProps
    }


    // check DateTimePicker index.js file in components/utils/DateTimePicker for explanation on why use function
    // instead of arrow function
    function addFile(files) {
        files = Array.from(files)
        const attachmentValues = valuesRef.current.map(value => value.value)
        const acceptedFiles = files.filter(file => !attachmentValues.includes(file.name))
        
        if (acceptedFiles.length > 0) {
            acceptedFiles.forEach(file => {
                attachmentValues.push(file.name)
            })
    
            const formValues = props.multipleValueFieldHelper(attachmentValues)
            _setValues([...formValues])
            if (props.addFieldFile) {
                props.addFieldFile(props.field.name, acceptedFiles)
            }
        } else {
            setShowAlert(true)
        }
    }

    function removeFile(e, value) {
        e.preventDefault();
        const attachmentValues = valuesRef.current.map(value => value.value)
        const indexToRemove = valuesRef.current.findIndex(formValue => formValue.value === value)
        attachmentValues.splice(indexToRemove, 1)

        const formValues = props.multipleValueFieldHelper(attachmentValues)

        _setValues([...formValues])
        props.removeFieldFile(props.field.name, value)
    }

    const onDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingOver(true)
    }

    const onDragEnd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingOver(false)
    }

    const onDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingOver(false)
        addFile(e.dataTransfer.files)
    }

    useEffect(() => {
        let newInputProps = [initialInputProps]
        props.values.forEach(value => {
            newInputProps.push(createInputProps(value))
        })
        setInputsProps(newInputProps)
        valuesRef.current = props.values
    }, [props.values])

    return (
        <Field.Attachment.Container onDrag={e => onDrag(e)} onDragOver={e=> onDragOver(e)} onDragEnd={e => onDragEnd(e)} onDragLeave={e => onDragEnd(e)} onDrop={e=> onDrop(e)}>
            <Alert 
            alertTitle={strings['pt-br']['formularyFieldAttachmentAlertTitle']} 
            alertMessage={strings['pt-br']['formularyFieldAttachmentAlertContent']} 
            show={showAlert} 
            onHide={() => {
                setShowAlert(false)
            }} 
            />
            {isDraggingOver ? (
                <AttachmentItem numberOfItems={1} isSectionConditional={props.isSectionConditional} isDragging={true} {...inputsProps[0]}/>
            ) : (
                <Field.Attachment.ScrollContainer>
                {inputsProps.map((inputProps, index)=> {
                    return (<AttachmentItem key={index} numberOfItems={inputsProps.length} isSectionConditional={props.isSectionConditional} {...inputProps}/>)
                })}
                </Field.Attachment.ScrollContainer>
            )}
        </Field.Attachment.Container>
    )
}

export default Attachment