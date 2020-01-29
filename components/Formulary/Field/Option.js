import React, { useState } from 'react'
import Select from 'components/Utils/Select'

const Option = (props) => {
    const [data, _] = useState(props.field.field_option.map(option => { return {value: option.option, label: option.option} }))
    const [value, setValue] = useState(props.getFieldFormValues(props.field.name))

    const onChange = (newData) => {
        const newValue = props.singleValueFieldsHelper(props.field.name, (newData.length === 0) ? '': newData[0])
        setValue(newValue)
    }

    const fieldValue =  (value.length === 0) ? []: [{ value:value[0].value, label: value[0].value }]

    return (
        <Select options={data} onChange={onChange} initialValues={fieldValue}/>
    )
}

export default Option