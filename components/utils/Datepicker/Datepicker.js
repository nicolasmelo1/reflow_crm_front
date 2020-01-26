import React, { useState, useEffect } from 'react'
import Hourpicker from './Hourpicker'
import { Field } from 'styles/Formulary'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DatePicker = (props) => {
    const rows = 6
    const cols = 7
    const dateGridLength = cols*rows
    const rowGrid = Array.apply(null, Array(rows)).map((_, i) => i)
    const colGrid = Array.apply(null, Array(cols)).map((_, i) => i)
    const today = new Date()
    const dayOfTheWeekReference = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const monthReference = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']


    const [isOpen, _setIsOpen] = useState(false)
    const [monthDates, setMonthDates] = useState(getMonthDetails(2020,0))
    const [month, setMonth] = useState(0)
    const [year, setYear] = useState(2020)
    const [translate3D, setTranslate3D] = useState(0)
    const [selectedDay, setSelectedDay] = useState(today)
    const [hourPickerIsOpen, setHourPickerIsOpen] = useState(false)

    const datePickerContainerRef = React.useRef(null)
    const datePickerRef = React.useRef(null);
    // check Select Component in components/Formulary/utils
     const setIsOpenRef = React.useRef(isOpen);
     const setIsOpen = data => {
         setIsOpenRef.current = data;
         _setIsOpen(data);
     };

    // we define this way because it needs for the JS compiler,
    // we use the function before calling it, please read this:
    // https://stackoverflow.com/a/9973503 
    // so we have to use the function keyword, without it, you might get into some errors, test it!
    function getMonthDetails(year, month) {
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
        if (month<0) {
            year = year - 1
            month = 11
        } else if (month>11){
            year = year + 1
            month = 0
        }
        const monthDetails = getMonthDetails(year, month)
        setMonth(month)
        setYear(year)
        setMonthDates(monthDetails)
    }

    const updateDate = (date) => {
        updateMonthDetails(date.getFullYear(), date.getMonth())
        setSelectedDay(date)
    }

    const isCurrentMonth = (monthToCheck) => monthToCheck === month
    const isSelectedDay = (dayToCheck) => selectedDay.getDate() === dayToCheck.getDate() && selectedDay.getMonth() === dayToCheck.getMonth() & selectedDay.getFullYear() === dayToCheck.getFullYear()
     
    const isToday = (dayToCheck) => today === dayToCheck

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
                    {hourPickerIsOpen ? (<Hourpicker selectedDay={selectedDay} setSelectedDay={setSelectedDay}/>) : (
                        <div>
                            <Field.Datepicker.YearContainer>
                                <Field.Datepicker.YearContainerItems onClick={e=>updateMonthDetails(year-1, month)}>
                                    <FontAwesomeIcon icon='chevron-left'/>
                                </Field.Datepicker.YearContainerItems>
                                <Field.Datepicker.YearContainerItems>
                                    {year}
                                </Field.Datepicker.YearContainerItems>
                                <Field.Datepicker.YearContainerItems onClick={e=>updateMonthDetails(year+1, month)}>
                                    <FontAwesomeIcon icon='chevron-right'/>
                                </Field.Datepicker.YearContainerItems>
                            </Field.Datepicker.YearContainer>
                            <Field.Datepicker.MonthContainer>
                                <Field.Datepicker.MonthContainerItems onClick={e=>updateMonthDetails(year, month-1)}>
                                    <FontAwesomeIcon icon='chevron-left'/>
                                </Field.Datepicker.MonthContainerItems>
                                <Field.Datepicker.MonthContainerItems>
                                    {monthReference[month]}
                                </Field.Datepicker.MonthContainerItems>
                                <Field.Datepicker.MonthContainerItems onClick={e=>updateMonthDetails(year, month+1)}>
                                    <FontAwesomeIcon icon='chevron-right'/>
                                </Field.Datepicker.MonthContainerItems>
                            </Field.Datepicker.MonthContainer>
                            <Field.Datepicker.Table>
                                <thead>
                                    <tr>
                                    {colGrid.map((_, index)=> (
                                        <Field.Datepicker.WeekdaysContainer key={index}>{dayOfTheWeekReference[index]}</Field.Datepicker.WeekdaysContainer>
                                    ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rowGrid.map((_, index)=> (
                                        <tr key={index}>
                                            {monthDates.slice(index*7, (index*7)+7).map((monthDate, index)=> (
                                                <Field.Datepicker.DateContainer 
                                                key={index} 
                                                isCurrentMonth={isCurrentMonth(monthDate.getMonth())} 
                                                isSelectedDay={isSelectedDay(monthDate)} 
                                                onClick={e=>{updateDate(monthDate)}} >
                                                    {monthDate.getDate()}
                                                </Field.Datepicker.DateContainer>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </Field.Datepicker.Table>
                            <div style={{width: '100%', textAlign: 'center'}}>
                                <FontAwesomeIcon icon="clock"/>
                            </div>
                        </div>
                    )}
                </Field.Datepicker.PickerContainer>
            ): ''}
        </Field.Datepicker.Container>
    )
}

export default DatePicker