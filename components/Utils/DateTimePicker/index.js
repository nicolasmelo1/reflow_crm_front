import React, {useEffect, useState} from 'react'
import DatePicker from './DatePicker'
import HourPicker from './HourPicker'
import Utils from 'styles/Utils'

/**
 * PLEASE, IMPORT THIS IN YOUR FILES, DO NOT IMPORT THE OTHER COMPONENTS IN THIS FOLDER DIRECTLY,
 * THEY ARE ONLY TO SUPPORT THIS ONE
 * 
 * Main component for the DateTimePicker, holds most of the logic od the datetimepicker component.
 * Rows defines the number of rows of the calendar, and cols defines the number of columns of the calendar.
 * Most of the logic of this component is defined using the JS Date API. 
 * The main logic of this happens on getMonthDetails function, i will explaing briefly how it works:
 * ```
 * new Date(2020, 0, 11); //returns 11th of January of the Year 2020
 * ```
 * Now here is another example:
 * ```
 * new Date(2020, 0, 40); //returns 9th of Februrary of the Year 2020
 * ```
 * With this, we only need to loop though the 42 dates grid (6*7) using the same month, year, hour and minute 
 * (hour and minute is necessary for the hour picker)
 * Don't forget the days of the week number, we need to sum it with our index to display the days before day 1 of the month we 
 * want to display.
 * 
 * @param {Array<String>} dayOfTheWeekReference - __(optional)__ - If you want to override the default day of the week values, 
 * please use 3 characters maximum on each String 
 * @param {Array<String>} monthReference - __(optional)__ - If you want to override the default month names reference to 
 * display for the user
 * @param {Date} initialDay - The initial Date selected, don't forget to send a Date type value
 * @param {function} onChange - The function to be called when the user changes the date
 * @param {React.Ref} input - The React reference to the input, we use this to open the Datetimepicker when the user clicks
 * @param {Boolean} withoutHourPicker - __(optional)__ - send `true` if you don't want the hourPicker, defaults to `false`
 */
const DateTimePicker = (props) => {
    const rows = 6
    const cols = 7
    const dateGridLength = cols*rows
    const today = new Date()
    const dayOfTheWeekReference = props.dayOfTheWeekReference || ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const monthReference = props.monthReference || ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const withoutHourPicker = props.withoutHourPicker || false 

    const [isOpen, _setIsOpen] = useState(false)
    const [month, setMonth] = useState(today.getMonth())
    const [year, setYear] = useState(today.getFullYear())
    const [monthDates, setMonthDates] = useState(getMonthDetails(year, month, today.getHours(), today.getMinutes()))
    const [translate3D, setTranslate3D] = useState(0)
    const [selectedDay, setSelectedDay] = useState(today)
    const [hourPickerIsOpen, setHourPickerIsOpen] = useState(false)
    
    const datePickerContainerRef = React.useRef(null)
    const datePickerRef = React.useRef(null);

    // check Select Component in components/utils
     const isOpenRef = React.useRef(isOpen);
     const setIsOpen = data => {
         isOpenRef.current = data;
         _setIsOpen(data);
     };

    // we define this way because it needs for the JS compiler,
    // we use the function before calling it, please read this:
    // https://stackoverflow.com/a/9973503 
    // so we have to use the function keyword, without it, you might get into some errors, test it!
    function getMonthDetails(year, month, hour, minute) {
        hour = hour || today.getHours()
        minute = minute || today.getMinutes()
        const monthDayOfTheWeekStart = (new Date(year, month)).getDay()
        let monthArray = []

        for (let index=0; index<dateGridLength; index++) {
            const dayOfTheMonth = index - monthDayOfTheWeekStart; 
            const date = new Date(year, month, dayOfTheMonth+1, hour, minute)
            monthArray.push(date)
        }
        return monthArray
    }
    
    const updateMonthDetails = (year, month, hour, minute) => {
        if (month<0) {
            year = year - 1
            month = 11
        } else if (month>11){
            year = year + 1
            month = 0
        }
        const monthDetails = getMonthDetails(year, month, hour, minute)
        setMonth(month)
        setYear(year)
        setMonthDates(monthDetails)
    }

    const updateDate = (date) => {
        updateMonthDetails(date.getFullYear(), date.getMonth(), date.getHours(), date.getMinutes())
        setSelectedDay(date)
        props.onChange(date)
    }

    const onInputClick = (e) => {
        e.stopPropagation();
        if ((props.input.current && props.input.current.contains(e.target)) || (datePickerRef.current && datePickerRef.current.contains(e.target))) {
            setIsOpen(true)
            topOrDown(e)
        } else if (isOpenRef.current) {
            setIsOpen(false)
        }
    }

    const topOrDown = (e) => {
        e.preventDefault()
        if(datePickerRef.current){
            const rect = datePickerContainerRef.current.getBoundingClientRect();
            if (rect.top+datePickerRef.current.offsetHeight>window.innerHeight){
                setTranslate3D(-datePickerRef.current.offsetHeight-props.input.current.offsetHeight)
            } else {
                setTranslate3D(0)
            }
        }
    }

    useEffect (() => {
        document.addEventListener("mousedown", onInputClick)
        document.addEventListener("scroll", topOrDown, true)
        return () => {
            document.removeEventListener("mousedown", onInputClick)
            document.removeEventListener("scroll", topOrDown, true)
        }
    })
    
    useEffect(() => {
        const dateToConsider = (props.initialDay && props.initialDay !== '') ? props.initialDay : today
        setSelectedDay(dateToConsider)
        updateMonthDetails(dateToConsider.getFullYear(), dateToConsider.getMonth(), dateToConsider.getHours(), dateToConsider.getMinutes())
    }, [props.initialDay])

    return (
        <Utils.Datepicker.Container ref={datePickerContainerRef}>
            {isOpen ? (
                <Utils.Datepicker.PickerContainer translate={translate3D} ref={datePickerRef}>
                    {
                    hourPickerIsOpen ? 
                    (<HourPicker 
                    selectedDay={selectedDay} 
                    updateDate={updateDate}
                    setHourPickerIsOpen={setHourPickerIsOpen}
                    />) 
                    : 
                    (<DatePicker 
                    dayOfTheWeekReference={dayOfTheWeekReference}
                    isDarkBackground={true}
                    setHourPickerIsOpen={setHourPickerIsOpen}
                    updateMonthDetails={updateMonthDetails}
                    withoutHourPicker={withoutHourPicker}
                    monthReference={monthReference}
                    selectedDays={[selectedDay]}
                    monthDates={monthDates}
                    updateDate={updateDate}
                    today={today}
                    month={month}
                    year={year}
                    rows={rows}
                    cols={cols}
                    />)
                    }
                </Utils.Datepicker.PickerContainer>
            ) : ''}
        </Utils.Datepicker.Container>
    )
}


export default DateTimePicker