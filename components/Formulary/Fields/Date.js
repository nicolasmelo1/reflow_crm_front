import React, {useState} from 'react'
import { Field } from 'styles/Formulary'
import DateTimePicker from 'components/utils/DateTimePicker'
import { strings } from 'utils/constants'
import moment from 'moment'

const Date = (props) => {
    const inputRef = React.useRef(null)

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

    const dayOfTheWeekReference = [
        strings['pt-br']['calendardayOfTheWeekReferenceSunday'],
        strings['pt-br']['calendardayOfTheWeekReferenceMonday'],
        strings['pt-br']['calendardayOfTheWeekReferenceTuesday'],
        strings['pt-br']['calendardayOfTheWeekReferenceWednesday'],
        strings['pt-br']['calendardayOfTheWeekReferenceThursday'],
        strings['pt-br']['calendardayOfTheWeekReferenceFriday'],
        strings['pt-br']['calendardayOfTheWeekReferenceSaturday']
    ]

    const momentJSDateFormat = {
        '%Y': 'YYYY',
        '%m': 'MM',
        '%d': 'DD',
        '%H': 'H',
        '%M': 'mm',
        '%S': 'ss'
    }
    
    function stringToJsDateFormat(date) {
        let format = props.field.date_configuration_date_format_type
        for (var key in momentJSDateFormat) {
            if (momentJSDateFormat.hasOwnProperty(key)) {
                format = format.replace(key, momentJSDateFormat[key])
            }
        }
        date = moment(date, format);
        return date.toDate()
    }

    function jsDateToStringFormat(date) {
        let newValue = props.field.date_configuration_date_format_type
        Object.keys(momentJSDateFormat).forEach(possibleFormat => {
            switch(possibleFormat) {
                case '%Y':
                    newValue = newValue.replace(possibleFormat, date.getFullYear().toString())
                    break;
                case '%m':
                    newValue = newValue.replace(possibleFormat, (date.getMonth()+1 < 10 ) ? '0' + (date.getMonth()+1).toString(): (date.getMonth()+1).toString())
                    break;
                case '%d':
                    newValue = newValue.replace(possibleFormat, (date.getDate() < 10 ) ? '0' + date.getDate().toString(): date.getDate().toString())
                    break;
                case '%H':
                    newValue = newValue.replace(possibleFormat, (date.getHours() < 10 ) ? '0' + date.getHours().toString(): date.getHours().toString())
                    break;
                case '%M':
                    newValue = newValue.replace(possibleFormat, (date.getMinutes() < 10 ) ? '0' + date.getMinutes().toString(): date.getMinutes().toString())
                    break;
                case '%S':
                    newValue = newValue.replace(possibleFormat, (date.getSeconds() < 10 ) ? '0' + date.getSeconds().toString(): date.getSeconds().toString())
                    break;
                default:
                    newValue
            }
        })
        return newValue
    }

    const onChange = (dateValue) => {
        const stringValue = jsDateToStringFormat(dateValue)
        const newValue = props.singleValueFieldsHelper(stringValue)
        props.setValues(newValue)
    }

    const fieldValue = (props.values.length === 0) ? '': props.values[0].value

    return (
        <>
            <Field.Text ref={inputRef} type="text" value={fieldValue} readOnly={true}/>
            <DateTimePicker 
            withoutHourPicker={false}
            input={inputRef} 
            onChange={onChange} 
            initialDay={stringToJsDateFormat(fieldValue)}
            monthReference={monthReference} 
            dayOfTheWeekReference={dayOfTheWeekReference}
            />
        </>
    )
}

export default Date