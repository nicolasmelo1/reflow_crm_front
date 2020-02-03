import React, { useState } from 'react'
import Select from 'components/Utils/Select'


const MultiOption = (props) => {
    const [data, _] = useState(props.field.field_option.map(option => { return {value: option.option, label: option.option} }))

    const onChange = (newData) => {
        const formValues = props.multipleValueFieldHelper(newData)
        props.setValues([...formValues])
    }

    const fieldValues = props.values.map(value=> { return { value: value.value, label: value.value }})

    return (
        <Select options={data} onChange={onChange} multiple={true} initialValues={fieldValues}/>
    )
}

export default MultiOption