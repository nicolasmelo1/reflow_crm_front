import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import Id from './Id'
import { Field } from '../../../styles/Formulary'
import DateTimePicker from '../../Utils/DateTimePicker'
import { strings } from '../../../utils/constants'
import { numberUnmasker, numberMasker } from '../../../utils/numberMasker'
import {
    pythonFormatToMomentJSFormat, 
    stringToJsDateFormat,
    jsDateToStringFormat,
    pythonFormatToNumberMarkerFormat
} from '../../../utils/dates'

const Datetime = (props) => {
    const [dateFormat, setDateFormat] = useState('')
    const inputRef = React.useRef(null)
    // ------------------------------------------------------------------------------------------
    const monthReference = [
        strings['pt-br']['calendarMonthReferenceJanuary'],
        strings['pt-br']['calendarMonthReferenceFebruary'],
        strings['pt-br']['calendarMonthReferenceMarch'],
        strings['pt-br']['calendarMonthReferenceApril'],
        strings['pt-br']['calendarMonthReferenceMay'],
        strings['pt-br']['calendarMonthReferenceJune'],
        strings['pt-br']['calendarMonthReferenceJuly'],
        strings['pt-br']['calendarMonthReferenceAugust'],
        strings['pt-br']['calendarMonthReferenceSeptember'],
        strings['pt-br']['calendarMonthReferenceOctober'],
        strings['pt-br']['calendarMonthReferenceNovember'],
        strings['pt-br']['calendarMonthReferenceDecember']
    ]
    // ------------------------------------------------------------------------------------------
    const dayOfTheWeekReference = [
        strings['pt-br']['calendardayOfTheWeekReferenceSunday'],
        strings['pt-br']['calendardayOfTheWeekReferenceMonday'],
        strings['pt-br']['calendardayOfTheWeekReferenceTuesday'],
        strings['pt-br']['calendardayOfTheWeekReferenceWednesday'],
        strings['pt-br']['calendardayOfTheWeekReferenceThursday'],
        strings['pt-br']['calendardayOfTheWeekReferenceFriday'],
        strings['pt-br']['calendardayOfTheWeekReferenceSaturday']
    ]
    // ------------------------------------------------------------------------------------------
    const onChange = (dateValue) => {
        // Reference: https://stackoverflow.com/a/643827
        if (Object.prototype.toString.call(dateValue) === '[object Date]') {
            const stringValue = jsDateToStringFormat(dateValue, pythonFormatToMomentJSFormat(dateFormat))
            const newValue = props.singleValueFieldsHelper(stringValue)
            props.setValues(newValue)
        } else {
            const numberFormat = pythonFormatToNumberMarkerFormat(dateFormat)
            const unmaskedValue = numberUnmasker(dateValue, numberFormat)
            const maskedValue = numberMasker(unmaskedValue, numberFormat)
            const newValue = props.singleValueFieldsHelper(maskedValue)
            props.setValues(newValue)
        }
    }
    // ------------------------------------------------------------------------------------------
    let fieldValue = (props.values.length === 0) ? '': props.values[0].value

    if (props.field.date_configuration_auto_update) {
        const today = new Date()
        fieldValue = jsDateToStringFormat(today, pythonFormatToMomentJSFormat(dateFormat))
    } else if (props.field.date_configuration_auto_create && props.values.length === 0) {
        const today = new Date()
        fieldValue = jsDateToStringFormat(today, pythonFormatToMomentJSFormat(dateFormat))
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (props.values.length > 1) {
            props.singleValueFieldsHelper(props.values[0].value)
        }
    }, [props.values])
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (props.field.date_configuration_date_format_type !== null && props.types.data.field_date_format_type !== null) {
            const format = props.types.data.field_date_format_type.filter(dateFormatType => dateFormatType.id === props.field.date_configuration_date_format_type)
            if (format && format.length > 0) {
                setDateFormat(format[0].format)
            }
        }
    }, [props.field.date_configuration_date_format_type, props.types.data.field_date_format_type])
    /////////////////////////////////////////////////////////////////////////////////////////////
    //########################################################################################//
    const renderMobile = () => {
        return (
            <View>
                {(props.field.date_configuration_auto_update || props.field.date_configuration_auto_create) ? (
                    <Id values={[{value: fieldValue}]}/>
                ): (
                    <View>
                    </View>
                )}
            </View>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <div>
                {(props.field.date_configuration_auto_update || props.field.date_configuration_auto_create) ? (
                    <Id values={[{value: fieldValue}]}/>
                ): (
                    <div>
                        <Field.Text ref={inputRef} type="text" value={fieldValue} onChange={(e) => onChange(e.target.value)} autoComplete={'whathever'}/>
                        <DateTimePicker 
                        focusOnInput={true}
                        withoutHourPicker={typeof(dateFormat) === 'string' && (!(dateFormat.includes('%H') || dateFormat.includes('%M')))}
                        input={inputRef} 
                        onChange={onChange} 
                        initialDay={(fieldValue !== '') ? stringToJsDateFormat(fieldValue, pythonFormatToMomentJSFormat(dateFormat)) : ''}
                        monthReference={monthReference} 
                        dayOfTheWeekReference={dayOfTheWeekReference}
                        />
                    </div>
                )}
            </div>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default Datetime