import React, { useState, useEffect } from 'react'
import { Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Field from '../../../styles/Formulary/Field'
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
        <Field.Attachment.ItemContainer isInitial={props.isInitial} numberOfItems={props.numberOfItems} isSectionConditional={props.isSectionConditional}>
            {(props.addFile) ? (
                <Field.Attachment.Label isInitial={props.isInitial} isSectionConditional={props.isSectionConditional}>
                    <Field.Attachment.Image isInitial={props.isInitial} src={(props.isInitial) ? "/add_icon.png" : `/${fileFormat}_icon.png`} isSectionConditional={props.isSectionConditional}/>
                    <Field.Attachment.Text isInitial={props.isInitial}>{(props.isInitial) ? strings['pt-br']['formularyFieldAttachmentDefaultLabel']: props.value.value}</Field.Attachment.Text>
                    <Field.Attachment.Input type="file" onChange={e => { props.addFile(e) }}/>
                </Field.Attachment.Label>
            ) : (
                <Field.Attachment.Label isInitial={props.isInitial} onClick={e=> {onClick()}} isSectionConditional={props.isSectionConditional}>
                    <Field.Attachment.Image isInitial={props.isInitial} src={(props.isInitial) ? "/add_icon.png" : `/${fileFormat}_icon.png`} isSectionConditional={props.isSectionConditional}/>
                    <Field.Attachment.Text isInitial={props.isInitial}>{(props.isInitial) ? strings['pt-br']['formularyFieldAttachmentDefaultLabel']: props.value.value}</Field.Attachment.Text>
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
    const [inputsProps, setInputsProps] = useState([initialInputProps])

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
    function addFile(e) {
        e.preventDefault();
        const attachmentValues = valuesRef.current.map(value => value.value)
        attachmentValues.push(e.target.files[0].name)

        const formValues = props.multipleValueFieldHelper(attachmentValues)
        _setValues([...formValues])
        if (props.addFieldFile) {
            props.addFieldFile(props.field.name, e.target.files[0])
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

    useEffect(() => {
        let newInputProps = [initialInputProps]
        props.values.forEach(value => {
            newInputProps.push(createInputProps(value))
        })
        setInputsProps(newInputProps)
        valuesRef.current = props.values
    }, [props.values])

    return (
        <Field.Attachment.Container>
            <Field.Attachment.ScrollContainer>
                {inputsProps.map((inputProps, index)=> {
                    return (<AttachmentItem key={index} numberOfItems={inputsProps.length} isSectionConditional={props.isSectionConditional} {...inputProps}/>)
                })}
            </Field.Attachment.ScrollContainer>
        </Field.Attachment.Container>
    )
}

export default Attachment