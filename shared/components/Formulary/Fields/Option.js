import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import Field from '../../../styles/Formulary/Field' 
import Select from '../../Utils/Select'


const Option = (props) => {
    const [options, setOptions] = useState(props.field.field_option.map(option => { return {value: option.option, label: option.option} }))
    const [isOpen, setIsOpen] = useState(false)
    
    const onChange = (newData) => {
        const newValue = props.singleValueFieldsHelper((newData.length === 0) ? '': newData[0])
        props.setValues(newValue)
    }
    
    const fieldValue =  (props.values.length === 0) ? []: [{ value: props.values[0].value, label: props.values[0].value }]

    useEffect(() => {
        if (props.values.length > 1) {
            props.singleValueFieldsHelper(props.values[0].value)
        }
    }, [props.values])

    useEffect(() => {
        setOptions(props.field.field_option.map(option => { return {value: option.option, label: option.option} }))
    }, [props.field.field_option])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <Field.Select isOpen={isOpen}>
                <Select options={options} onChange={onChange} initialValues={fieldValue} setIsOpen={setIsOpen} isOpen={isOpen}/>
            </Field.Select>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default Option