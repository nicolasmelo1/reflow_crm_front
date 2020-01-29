import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

const LongText = (props) => {
    const [value, setValue] = useState(props.getFieldFormValues(props.field.name))

    const onChange = (e) => {
        e.preventDefault();
        const newValue = props.singleValueFieldsHelper(props.field.name, e.target.value)
        setValue(newValue)
    }

    const fieldValue = (value.length === 0) ? '': value[0].value

    return (
        <Form.Control as="textarea" value={fieldValue} onChange={e=> {onChange(e)}}/>
    )
}

export default LongText