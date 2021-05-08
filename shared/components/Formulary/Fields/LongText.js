import React, { useState, useEffect } from 'react'
import { TextInput } from 'react-native'
import { Field } from '../../../styles/Formulary'
import deepCopy from '../../../utils/deepCopy'

const LongText = (props) => {
    const fieldValueRef = React.useRef({})
    const [stringValue, setStringValue] = useState('')

    const changeInitialData = (initialValue) => {
        setStringValue(initialValue)
    }

    const onChange = (text) => {
        const newValue = props.singleValueFieldsHelper(text)
        props.setValues(newValue)
    }

    useEffect(() => {
        if (props.values.length > 0 && JSON.stringify(props.values) !== JSON.stringify(fieldValueRef.current)) {
            changeInitialData(props.values[0].value)
            fieldValueRef.current = deepCopy(props.values)
        }
    }, [props.values])

    const renderMobile = () => {
        return (
            <TextInput multiline={true} value={stringValue}/>
        )
    }

    const renderWeb = () => {
        return (
            <Field.Text className="form-control" as="textarea" 
            value={stringValue} 
            onChange={e=> {onChange(e.target.value)}} 
            autoComplete={'whathever'}/>
        ) 
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default LongText