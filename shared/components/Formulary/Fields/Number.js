import React, { useState, useEffect } from 'react'
import { TextInput } from 'react-native'
import { Field } from '../../../styles/Formulary'
import formatNumber from '../../../utils/formatNumber'
import Id from './Id'


const Number = (props) => {
    const [numberFormat, setNumberFormat] = useState({})
    const [elementSelectionStart, setElementSelectionStart] = useState(0)
    let input = React.createRef()

    const numberMasker = (element, numberFormat) => {
        let suffix = (numberFormat.suffix) ? numberFormat.suffix : '';
        let thousandSeparator = (numberFormat.thousand_separator) ? numberFormat.thousand_separator : '';
        
        // thousands work differntly than expected
        let selectionStart = (thousandSeparator !== '') ? element.selectionStart+1: element.selectionStart;

        const newValue = formatNumber(element.value, numberFormat)

        // moves blink while writing
        let moveBlinkTo = newValue.length - suffix.length

        if (selectionStart >= moveBlinkTo || selectionStart === 1) {
            setElementSelectionStart(moveBlinkTo)
        } else {
            setElementSelectionStart((thousandSeparator !== '') ? selectionStart-1: selectionStart)
        }

        return newValue
    }

    const onChangeNumberValue = (e) => {
        const formattedValue = numberMasker(e.target, numberFormat)
        const newValue = props.singleValueFieldsHelper((formattedValue===undefined) ? '': formattedValue)
        props.setValues(newValue)
    }

    useEffect (() => {
        if (document.activeElement === input.current) {
            input.current.selectionStart = elementSelectionStart
            input.current.selectionEnd = elementSelectionStart
        }
    })
    
    useEffect(() => {
        if (props.field.number_configuration_number_format_type !== null && props.types.data.field_number_format_type !== null) {
            const format = props.types.data.field_number_format_type.filter(numberFormatType => numberFormatType.id === props.field.number_configuration_number_format_type)
            if (format && format.length > 0) {
                setNumberFormat(format[0])
            }
        }
    }, [props.field.number_configuration_number_format_type, props.types.data.field_number_format_type])


    const fieldValue = (props.values.length === 0) ? '': props.values[0].value

    const renderMobile = () => {
        return (
            <TextInput value={fieldValue}/>
        )
    }

    const renderWeb = () => {
        return (
            <React.Fragment>
                {['', null].includes(props.field.formula_configuration) ? (
                    <Field.Text type="text" value={fieldValue} ref={input} onChange={e => {onChangeNumberValue(e)}} autoComplete={'whathever'}/>
                ) : (
                    <Id values={fieldValue && fieldValue !== '' && fieldValue !== null ? [{value: fieldValue}] : []}/>
                )}
            </React.Fragment>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default Number