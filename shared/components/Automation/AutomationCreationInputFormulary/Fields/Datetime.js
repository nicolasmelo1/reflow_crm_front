import React from 'react'
import { View } from 'react-native'
import { DateTimePicker }  from '../../../Utils'
import { strings } from '../../../../utils/constants'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Datetime = (props) => {
    const inputRef = React.useRef()

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

    const onChange = (dateValue) => {
        // Reference: https://stackoverflow.com/a/643827
        /*if (Object.prototype.toString.call(dateValue) === '[object Date]') {
            const stringValue = jsDateToStringFormat(dateValue, pythonFormatToMomentJSFormat(dateFormat))
            const newValue = props.singleValueFieldsHelper(stringValue)
            props.setValues(newValue)
        } else {
            const numberFormat = pythonFormatToNumberMarkerFormat(dateFormat)
            const unmaskedValue = numberUnmasker(dateValue, numberFormat)
            const maskedValue = numberMasker(unmaskedValue, numberFormat)
            const newValue = props.singleValueFieldsHelper(maskedValue)
            props.setValues(newValue)
        }*/
    }


    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <Styled.AutomationCreationInputFormularyFieldTextInput 
                ref={inputRef}
                type="text"
                />
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
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Datetime