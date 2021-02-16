import React from 'react'
import { TextInput } from 'react-native'
import { Field } from '../../../styles/Formulary'


const Email = (props) => {
    const onChange = (e) => {
        e.preventDefault();
        const newValue = props.singleValueFieldsHelper(e.target.value)
        props.setValues(newValue)
    }

    const fieldValue = (props.values.length === 0) ? '': props.values[0].value

    const renderMobile = () => {
        return (
            <TextInput value={fieldValue}/>
        )
    }

    const renderWeb = () => {
        return(
            <Field.Text type="text" value={fieldValue} onChange={e=> {onChange(e)}} autoComplete={'whathever'}/>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default Email