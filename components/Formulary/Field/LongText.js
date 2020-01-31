import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

const LongText = (props) => {

    const onChange = (e) => {
        e.preventDefault();
        const newValue = props.singleValueFieldsHelper(e.target.value)
        props.setValues(newValue)
    }

    const fieldValue = (props.values.length === 0) ? '': props.values[0].value
    console.log('teste')
    return (
        <Form.Control as="textarea" value={fieldValue} onChange={e=> {onChange(e)}}/>
    )
}

export default LongText