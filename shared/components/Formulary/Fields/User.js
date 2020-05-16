import React, { useState } from 'react'
import Field from '../../../styles/Formulary/Field' 
import Select from '../../Utils/Select'

const User = (props) => {
    const [data, _] = useState(props.userOptions ? props.userOptions.map(option => ({value: option.id, label: `${option.first_name} ${option.last_name}`})) : [])
    const [isOpen, setIsOpen] = useState(false)
    
    const onChange = (newData) => {
        const newValue = props.singleValueFieldsHelper((newData.length === 0) ? '': newData[0])
        props.setValues(newValue)
    }
    
    const fieldValue =  (props.values.length === 0) ? []: data.filter(initialOption => initialOption.value.toString() === props.values[0].value.toString())

    return (
        <Field.Select isOpen={isOpen}>
            <Select options={data} onChange={onChange} initialValues={fieldValue} setIsOpen={setIsOpen} isOpen={isOpen}/>
        </Field.Select>
    )
}

export default User