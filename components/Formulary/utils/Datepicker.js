import React, { useState, useEffect } from 'react'
import { Field } from 'styles/Formulary'

const DatePicker = (props) => {
    const rows = 6
    const cols = 7
    const dateGridLength = cols*rows
    const dateGrid = Array.apply(null, Array(rows)).map((x, i) => i)
    const oneDay = 60 * 60 * 24 * 1000;
    const todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);

    const [isOpen, _setIsOpen] = useState(false)
    const [monthDates, setMonthDates] = useState(getMonthDetails(2020,0))

    // we define this way because it needs for the JS compiler, please read this:
    // https://stackoverflow.com/a/9973503 
    // so we have to use the function keyword, without it, you might get into some errors, test it!
    function getMonthDetails (year, month) {
        const monthDayOfTheWeekStart = (new Date(year, month)).getDay()
        let monthArray = []

        for (let index=0; index<dateGridLength; index++) {
            const dayOfheWeek = index - monthDayOfTheWeekStart; 
            const date = new Date(year, month, dayOfheWeek+1)
            monthArray.push(date)
        }
        return monthArray
    }
    
    const updateMonthDetails = (year, month) => {
        const monthDetails = getMonthDetails(year, month)
        setMonthDates(monthDetails)
    }

    // check Select Component in components/Formulary/utils
    const setIsOpenRef = React.useRef(isOpen);
    const setIsOpen = data => {
        setIsOpenRef.current = data;
        _setIsOpen(data);
    };

    const onInputClick = (e) => {
        e.stopPropagation();
        if (props.input.current && props.input.current.contains(e.target)) {
            setIsOpen(true)
        } else if (setIsOpenRef.current) {
            setIsOpen(false)
        }
    }

    useEffect (() => {
        document.addEventListener("mousedown", onInputClick)
        return () => {
            document.removeEventListener("mousedown", onInputClick)
        }
    })

    console.log(dateGrid)
    return (
        <div style={{position:'relative'}}>
            {isOpen ? (
                <Field.Datepicker.PickerContainer>
                    <table>
                        <tbody>
                            {dateGrid.map((_, index)=> (
                                <tr key={index}>
                                    {monthDates.slice(index*7, (index*7)+7).map((monthDate, index)=> (
                                        <td key={index}>
                                            {monthDate.getDate()}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Field.Datepicker.PickerContainer>
            ): ''}
        </div>
    )
    
}

export default DatePicker