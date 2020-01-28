import React, { useState } from 'react'
import Select from 'components/utils/Select'

const Option = (props) => {
    const [data, setData] = useState(props.data.field_option.map(option => { return {value: option.option, label: option.option} }))

    const onChange = (newData) => {
        setData(newData)
    }

    return (
        <Select options={data} onChange={onChange} multiple={true}/>
    )
}

export default Option