import React, {useState} from 'react'
import { Field } from 'styles/Formulary'
import DateTimePicker from 'components/utils/DateTimePicker'
import { strings } from 'utils/constants'
import moment from 'moment'

const Date = (props) => {
    const inputRef = React.useRef(null)
    const [value, setValue] = useState('')
    const [fieldValue, setFieldValue] = useState('')

    const momentJSDateFormat = {
        '%Y': 'YYYY',
        '%m': 'MM',
        '%d': 'DD',
        '%H': 'H',
        '%M': 'mm',
        '%S': 'ss'
    }
    
    function stringToJsDateFormat(value) {
        let format = props.data.date_configuration_date_format_type
        for (var key in momentJSDateFormat) {
            if (momentJSDateFormat.hasOwnProperty(key)) {
                format = format.replace(key, momentJSDateFormat[key])
            }
        }
        value = moment(value, format);
        return value.toDate()
    }

    function jsDateToStringFormat(value) {
        let newValue = props.data.date_configuration_date_format_type
        Object.keys(momentJSDateFormat).forEach(possibleFormat => {
            switch(possibleFormat) {
                case '%Y':
                    newValue = newValue.replace(possibleFormat, value.getFullYear().toString())
                    break;
                case '%m':
                    newValue = newValue.replace(possibleFormat, (value.getMonth()+1 < 10 ) ? '0' + (value.getMonth()+1).toString(): (value.getMonth()+1).toString())
                    break;
                case '%d':
                    newValue = newValue.replace(possibleFormat, (value.getDate() < 10 ) ? '0' + value.getDate().toString(): value.getDate().toString())
                    break;
                case '%H':
                    newValue = newValue.replace(possibleFormat, (value.getHours() < 10 ) ? '0' + value.getHours().toString(): value.getHours().toString())
                    break;
                case '%M':
                    newValue = newValue.replace(possibleFormat, (value.getMinutes() < 10 ) ? '0' + value.getMinutes().toString(): value.getMinutes().toString())
                    break;
                case '%M':
                    newValue = newValue.replace(possibleFormat, (value.getMinutes() < 10 ) ? '0' + value.getMinutes().toString(): value.getMinutes().toString())
                    break;
                default:
                    newValue
            }
        })
        return newValue
    }

    const onChange = (value) => {
        setFieldValue(jsDateToStringFormat(value))
        setValue(value)
    }

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
    return (
        <>
            <Field.Text ref={inputRef} type="text" value={fieldValue} readOnly={true}/>
            <DateTimePicker 
            withoutHourPicker={false}
            input={inputRef} 
            onChange={onChange} 
            initialDay={value}
            monthReference={monthReference} 
            dayOfTheWeekReference={dayOfTheWeekReference}
            />
        </>
    )
}

export default Date