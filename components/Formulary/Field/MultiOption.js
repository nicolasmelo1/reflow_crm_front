import React, { useState } from 'react'
import Select from 'components/Utils/Select'


const MultiOption = (props) => {
    const [data, _] = useState(props.data.field_option.map(option => { return {value: option.option, label: option.option} }))
    const [value, setValue] = useState([])

    const onChange = (newData) => {
        setValue(newData)
    }

    return (
        <Select options={data} onChange={onChange} multiple={true}/>
    )
}

export default MultiOption