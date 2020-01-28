import React, {useState} from 'react'
import Field from 'styles/Formulary/Field'
import { Row, Col } from 'react-bootstrap'

const AttachmentItem = (props) => {
    return  (
        <Field.Attachment.Container isInitial={props.isInitial}>
            <Field.Attachment.Label isInitial={props.isInitial}>
                <Field.Attachment.Image isInitial={props.isInitial} src={(props.isInitial) ? "/add_icon.png" : props.imageSrc}/>
                <Field.Attachment.Text isInitial={props.isInitial}>{(props.isInitial) ? 'Clique ou arraste arquivos aqui': props.fileName}</Field.Attachment.Text>
                <Field.Attachment.Input type="file" onChange={e => { props.addFile(e, props.index) }}/>
            </Field.Attachment.Label>
        </Field.Attachment.Container>
    )
}

const Attachment = (props) => {
    const [inputs, setInputs] = useState([<AttachmentItem isInitial={true} addFile={addFile}/>])
    const [values, setValues] = useState([])

    function addFile(e, index) {
        e.preventDefault();
        values.push(e.target.files[0])
        const splittedFullName = e.target.files[0].name.split('.');
        const fileFormat = splittedFullName[splittedFullName.length-1];
        const fileName = e.target.files[0].name;
        if (index === 0) {
            index = inputs.length
            inputs.push(<AttachmentItem initial={false} addFile={addFile} imageSrc={`/${fileFormat}_icon.png`} fileName={fileName}/>)
        } else {
            inputs.splice(index, 1, <AttachmentItem initial={false} addFile={addFile} imageSrc={`/${fileFormat}_icon.png`} fileName={fileName}/>)
        }
        setValues([...values])
        setInputs([...inputs])
    }

    return (
        <div>
            <Row>
                {inputs.map((input, index)=> {
                    const AttachmentItemCopy = AttachmentItem
                    return (<AttachmentItemCopy key={index} index={index} {...input.props}/>)
                })}
            </Row>
        </div>
    )
}

export default Attachment