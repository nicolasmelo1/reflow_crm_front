import React, {useState} from 'react'
import { Field } from 'styles/Formulary'
import Datepicker from 'components/utils/Datepicker'
import { strings } from 'utils/constants'

const Date = (props) => {
    const inputRef = React.useRef(null)
    const [value, setValue] = useState('')

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
            <Field.Text ref={inputRef} type="text" value={value} readOnly={true}/>
            <Datepicker 
            input={inputRef} 
            onChange={setValue} 
            monthReference={monthReference} 
            dayOfTheWeekReference={dayOfTheWeekReference}
            />
        </>
    )
}

export default Date