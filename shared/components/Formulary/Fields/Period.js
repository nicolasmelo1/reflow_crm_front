import React, { useState, useEffect } from 'react'
import { TextInput } from 'react-native'
import { Field } from '../../../styles/Formulary'
import { types } from '../../../utils/constants'

const Period = (props) => {
    const [periodFormat, setPeriodFormat] = useState({})
    const [elementSelectionStart, setElementSelectionStart] = useState(0)
    let input = React.createRef()

    const periodMasker = (input, periodFormat) => {
        const value = input.value.replace(/[^0-9]/g,'')
        if (input.selectionStart < value.length){
            setElementSelectionStart(input.selectionStart)
        } else {
            setElementSelectionStart(value.length)
        }
        const periodText = (value !== '' && parseInt(value) === 1) ? types('pt-br', 'period_configuration_period_format_type', periodFormat.type) : types('pt-br', 'period_configuration_periods_format_type', periodFormat.type) 
        return (value !== '') ? value + ` ${periodText}` : ''
    }

    const onChangePeriodValue = (e) => {
        const formattedValue = periodMasker(e.target, periodFormat)
        const newValue = props.singleValueFieldsHelper((formattedValue===undefined) ? '': formattedValue)
        props.setValues(newValue)
    }

    useEffect(() => {
        if (props.values.length > 1) {
            props.singleValueFieldsHelper(props.values[0].value)
        }
    }, [props.values])
    
    useEffect (() => {
        if (document.activeElement === input.current) {
            input.current.selectionStart = elementSelectionStart
            input.current.selectionEnd = elementSelectionStart
        }
    })
    

    useEffect(() => {
        if (props.field.period_configuration_period_interval_type !== null && props.types.data.field_period_interval_type !== null) {
            const format = props.types.data.field_period_interval_type.filter(numberFormatType => numberFormatType.id === props.field.period_configuration_period_interval_type)
            if (format && format.length > 0) {
                setPeriodFormat(format[0])
            }
        }
    }, [props.field.period_configuration_period_interval_type, props.types.data.field_period_interval_type])


    const fieldValue = (props.values.length === 0) ? '': props.values[0].value

    const renderMobile = () => {
        return (
            <TextInput value={fieldValue}/>
        )
    }

    const renderWeb = () => {
        return (
            <Field.Text type="text" value={fieldValue} ref={input} onChange={e => {onChangePeriodValue(e)}}/>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default Period