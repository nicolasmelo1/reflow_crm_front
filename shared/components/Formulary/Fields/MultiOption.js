import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import Select from '../../Utils/Select'
import Field from '../../../styles/Formulary/Field' 

const MultiOption = (props) => {
    const [data, _] = useState(props.field.field_option.map(option => { return {value: option.option, label: option.option} }))
    const [isOpen, setIsOpen] = useState(false)

    const onChange = (newData) => {
        const formValues = props.multipleValueFieldHelper(newData)
        props.setValues([...formValues])
    }

    const fieldValues = props.values.map(value=> { return { value: value.value, label: value.value }})

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <Field.Select isOpen={isOpen}>
                <Select options={data} onChange={onChange} multiple={true} initialValues={fieldValues} isOpen={isOpen} setIsOpen={setIsOpen}/>
            </Field.Select>
        )
    } 

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default MultiOption