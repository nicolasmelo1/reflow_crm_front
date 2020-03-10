import React, { useState, useEffect } from 'react'
import { Field } from 'styles/Formulary'


const Number = (props) => {
    const [numberFormat, setNumberFormat] = useState({})
    const [elementSelectionStart, setElementSelectionStart] = useState(0)
    let input = React.createRef()

    const numberMasker = (element, data) => {
        let newValue = ''

        let oldValue = element.value

        let prefix = (data.prefix) ? data.prefix : '';
        let suffix = (data.suffix) ? data.suffix : '';
        let thousandSeparator = (data.thousand_separator) ? data.thousand_separator : '';
        let decimalSeparator = (data.decimal_separator) ? data.decimal_separator : '';

        // thousands work differntly than expected
        let selectionStart = (thousandSeparator !== '') ? element.selectionStart+1: element.selectionStart;
        
        // get negative symbol
        let negative = oldValue
        if (data.suffix) {
            let regexSufix =  new RegExp(`(\\${data.suffix})$`,"m");
            negative = oldValue.replace(regexSufix,'')
        } 
        if (data.prefix){
            let regexPrefix =  new RegExp(`(^\\${data.prefix})`,"m");
            negative = negative.replace(regexPrefix,'')
        }
        negative = (negative.charAt(0) == '-') ? '-': '';

        // add decimals and validate decimals
        let valueWithDecimal = oldValue
        if (data.decimal_separator) {
            valueWithDecimal = valueWithDecimal.split(decimalSeparator)
            valueWithDecimal = valueWithDecimal.slice(0,2).map(value => value.replace(/\D/g,''))
        } else {
            valueWithDecimal = [valueWithDecimal.replace(/\D/g,'')]
        }
        // Add thousand separator
        valueWithDecimal[0] = valueWithDecimal[0].split("").reverse().join("").replace(/(.{3})/g, `$1${thousandSeparator}`).split("").reverse().join("")
        if (data.thousand_separator) {
            let regexInitWithThousandSeparator = new RegExp(`^(\\${thousandSeparator})`, 'g');
            valueWithDecimal[0] = valueWithDecimal[0].replace(regexInitWithThousandSeparator, '')
        }
        oldValue = valueWithDecimal.join(decimalSeparator)
        newValue = prefix + negative + oldValue + suffix;
    
        let moveBlinkTo = newValue.length - suffix.length;

        if (selectionStart >= moveBlinkTo || selectionStart === 1) {
            setElementSelectionStart(moveBlinkTo);
        } else {
            setElementSelectionStart((thousandSeparator !== '') ? selectionStart-1: selectionStart);
        }
        return newValue
    }

    const onChangeNumberValue = (e) => {
        const formattedValue = numberMasker(e.target, numberFormat)
        const newValue = props.singleValueFieldsHelper((formattedValue===undefined) ? '': formattedValue)
        props.setValues(newValue)
    }

    useEffect (() => {
        input.current.selectionStart = elementSelectionStart
        input.current.selectionEnd = elementSelectionStart
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

    return (
        <Field.Text type="text" value={fieldValue} ref={input} onChange={e => {onChangeNumberValue(e)}}/>
    )
}

export default Number