import React, {useEffect, useState} from 'react'
import Datepicker from './Datepicker'
import Hourpicker from './Hourpicker'
import { Field } from 'styles/Formulary'

export default (props) => {
    const rows = 6
    const cols = 7
    const dateGridLength = cols*rows
    const today = new Date()
    const dayOfTheWeekReference = props.dayOfTheWeekReference || ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const monthReference = props.monthReference || ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    const [isOpen, _setIsOpen] = useState(false)
    const [month, setMonth] = useState(today.getMonth())
    const [year, setYear] = useState(today.getFullYear())
    const [monthDates, setMonthDates] = useState(getMonthDetails(year, month, today.getHours(), today.getMinutes()))
    const [translate3D, setTranslate3D] = useState(0)
    const [selectedDay, setSelectedDay] = useState(props.initialDay || today)
    const [hourPickerIsOpen, setHourPickerIsOpen] = useState(false)

    const datePickerContainerRef = React.useRef(null)
    const datePickerRef = React.useRef(null);

    // check Select Component in components/utils
     const setIsOpenRef = React.useRef(isOpen);
     const setIsOpen = data => {
         setIsOpenRef.current = data;
         _setIsOpen(data);
     };

    // we define this way because it needs for the JS compiler,
    // we use the function before calling it, please read this:
    // https://stackoverflow.com/a/9973503 
    // so we have to use the function keyword, without it, you might get into some errors, test it!
    function getMonthDetails(year, month, hour, minute) {
        const monthDayOfTheWeekStart = (new Date(year, month)).getDay()
        let monthArray = []

        for (let index=0; index<dateGridLength; index++) {
            const dayOfheWeek = index - monthDayOfTheWeekStart; 
            const date = new Date(year, month, dayOfheWeek+1, hour, minute)
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
        } else if (setIsOpenRef.current) {
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

    return (
        <Field.Datepicker.Container ref={datePickerContainerRef}>
            {isOpen ? (
                <Field.Datepicker.PickerContainer translate={translate3D} ref={datePickerRef}>
                    {
                    hourPickerIsOpen ? 
                    (<Hourpicker 
                    selectedDay={selectedDay} 
                    updateDate={updateDate}
                    setHourPickerIsOpen={setHourPickerIsOpen}
                    />) 
                    : 
                    (<Datepicker 
                    dayOfTheWeekReference={dayOfTheWeekReference}
                    setHourPickerIsOpen={setHourPickerIsOpen}
                    updateMonthDetails={updateMonthDetails}
                    monthReference={monthReference}
                    selectedDay={selectedDay}
                    monthDates={monthDates}
                    updateDate={updateDate}
                    today={today}
                    month={month}
                    year={year}
                    rows={rows}
                    cols={cols}
                    />)
                    }
                </Field.Datepicker.PickerContainer>
            ) : ''}
        </Field.Datepicker.Container>
    )
}