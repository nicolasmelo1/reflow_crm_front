import React, {useState} from 'react'
import Field from 'styles/Formulary/Field'
import { Row, Col } from 'react-bootstrap'

const AttachmentItem = (props) => {
    return  (
        <Field.Attachment.Container>
            <label>
                <Field.Attachment.Image src={(props.initial) ? "/add_icon.png" : props.imageSrc}/>
                <p>{(props.initial) ? 'Clique ou arraste arquivos aqui': props.fileName}</p>
                <Field.Attachment.Input type="file" onChange={e => { props.addFile(e) }}/>
            </label>
        </Field.Attachment.Container>
    )
}

const Attachment = (props) => {
    const [inputs, setInputs] = useState([<AttachmentItem initial={true} addFile={addFile}/>])

    function addFile(e) {
        e.preventDefault();
        e.target.files[0]
        const splittedFullName = e.target.files[0].name.split('.');
        const fileFormat = splittedFullName[splittedFullName.length-1];
        const fileName = e.target.files[0].name;

        inputs.splice(0, 0, (<AttachmentItem initial={false} addFile={addFile} imageSrc={`/${fileFormat}_icon.png`} fileName={fileName}/>))
        setInputs([...inputs])
    }

    return (
        <div>
            <Row>
                {inputs.map(input=> input)}
            </Row>
        </div>
    )
}

export default Attachment