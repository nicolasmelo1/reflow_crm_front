import React, { useState } from 'react'
import Field from 'styles/Formulary/Field' 
import Select from 'components/Utils/Select'

const Option = (props) => {
    const [data, _] = useState(props.field.field_option.map(option => { return {value: option.option, label: option.option} }))
    const [isOpen, setIsOpen] = useState(false)
    
    const onChange = (newData) => {
        const newValue = props.singleValueFieldsHelper((newData.length === 0) ? '': newData[0])
        props.setValues(newValue)
    }

    const fieldValue =  (props.values.length === 0) ? []: [{ value: props.values[0].value, label: props.values[0].value }]

    return (
        <Field.Select isOpen={isOpen}>
            <Select options={data} onChange={onChange} initialValues={fieldValue} setIsOpen={setIsOpen} isOpen={isOpen}/>
        </Field.Select>
    )
}

export default Option