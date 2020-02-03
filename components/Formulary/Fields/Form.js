import React, { useState } from 'react'
import Select from 'components/Utils/Select'

const Form = (props) => {
    const [data, _] = useState(props.field.form_field_as_option.field_value.map(option => { return {value: option.form_id, label: option.value} }))

    const onChange = (newData) => {
        const newValue = props.singleValueFieldsHelper((newData.length === 0) ? '': newData[0])
        props.setValues(newValue)
    }

    let fieldValue = []
    if(props.values.length !== 0){
        const selectedOption = props.field.form_field_as_option.field_value.filter(option => option.form_id.toString() === props.values[0].value.toString())
        fieldValue = [{ value: selectedOption[0].form_id, label: selectedOption[0].value }]
    }
    return (
        <Select options={data} onChange={onChange} initialValues={fieldValue}/>
    )
}

export default Form