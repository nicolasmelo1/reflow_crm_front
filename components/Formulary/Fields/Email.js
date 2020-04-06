import React from 'react'
import { Field } from 'styles/Formulary'


const Email = (props) => {
    const onChange = (e) => {
        e.preventDefault();
        const newValue = props.singleValueFieldsHelper(e.target.value)
        props.setValues(newValue)
    }

    const fieldValue = (props.values.length === 0) ? '': props.values[0].value

    return(
        <Field.Text type="text" value={fieldValue} onChange={e=> {onChange(e)}}/>
    )
}

export default Email