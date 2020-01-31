import React, {useState} from 'react'
import Field from 'styles/Formulary/Field'
import { Row, Button } from 'react-bootstrap'
import { strings } from 'utils/constants'

const AttachmentItem = (props) => {
    return (
        <Field.Attachment.Container isInitial={props.isInitial}>
            <Field.Attachment.Label isInitial={props.isInitial}>
                <Field.Attachment.Image isInitial={props.isInitial} src={(props.isInitial) ? "/add_icon.png" : props.imageSrc}/>
                <Field.Attachment.Text isInitial={props.isInitial}>{(props.isInitial) ? strings['pt-br']['formularyFieldAttachmentDefaultLabel']: props.fileName}</Field.Attachment.Text>
                {(props.addFile) ? (
                    <Field.Attachment.Input type="file" onChange={e => { props.addFile(e, props.index) }}/>
                ) : ''}
            </Field.Attachment.Label>
            {(props.removeFile) ? (
                <Button onClick={e=> {props.removeFile(e, props.index, props.fileName)}}> Excluir arquivo </Button>
            ): ''}
        </Field.Attachment.Container>
    )
}

const Attachment = (props) => {
    const [inputsProps, setInputsProps] = useState([{ 
        isInitial: true, 
        addFile: addFile 
    }])

    // check Select Component in components/utils
    const valuesRef = React.useRef(props.values);
    const _setValues = data => {
        valuesRef.current = data;
        props.setValues(data);
    };

    // check DateTimePicker index.js file in components/utils/DateTimePicker for explanation on why use function
    // instead of arrow function
    function addFile(e) {
        e.preventDefault();
        const attachmentValues = valuesRef.current.map(value => value.value)
        attachmentValues.push(e.target.files[0].name)

        const splittedFullName = e.target.files[0].name.split('.');
        const fileFormat = splittedFullName[splittedFullName.length-1];
        const fileName = e.target.files[0].name;
        const inputProps = { 
            initial: false,
            imageSrc:`/${fileFormat}_icon.png`, 
            fileName: fileName,
            removeFile: removeFile
        }

        inputsProps.push(inputProps)

        const formValues = props.multipleValueFieldHelper(attachmentValues)
        _setValues([...formValues])
        setInputsProps([...inputsProps])
    }

    function removeFile(e, index, value) {
        e.preventDefault();
        const attachmentValues = valuesRef.current.map(value => value.value)
        const indexToRemove = valuesRef.current.findIndex(formValue => formValue.value === value)
        attachmentValues.splice(indexToRemove, 1)
        inputsProps.splice(index, 1)

        const formValues = props.multipleValueFieldHelper(attachmentValues)

        _setValues([...formValues])
        setInputsProps([...inputsProps])
    }

    return (
        <div>
            <Row>
                {inputsProps.map((inputProps, index)=> {
                    return (<AttachmentItem key={index} index={index} {...inputProps}/>)
                })}
            </Row>
        </div>
    )
}

export default Attachment