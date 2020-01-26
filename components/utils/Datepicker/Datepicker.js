import React, { useState, useEffect } from 'react'
import Hourpicker from './Hourpicker'
import { Field } from 'styles/Formulary'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const DatePickerHeader = (props) => {
    return (
        <div>
            <Field.Datepicker.YearContainer>
                <Field.Datepicker.YearContainerItems onClick={e=>props.updateMonthDetails(props.year-1, props.month)}>
                    <FontAwesomeIcon icon='chevron-left'/>
                </Field.Datepicker.YearContainerItems>
                <Field.Datepicker.YearContainerItems>
                    {props.year}
                </Field.Datepicker.YearContainerItems>
                <Field.Datepicker.YearContainerItems onClick={e=>props.updateMonthDetails(props.year+1, props.month)}>
                    <FontAwesomeIcon icon='chevron-right'/>
                </Field.Datepicker.YearContainerItems>
            </Field.Datepicker.YearContainer>
            <Field.Datepicker.MonthContainer>
                <Field.Datepicker.MonthContainerItems onClick={e=>props.updateMonthDetails(props.year, props.month-1)}>
                    <FontAwesomeIcon icon='chevron-left'/>
                </Field.Datepicker.MonthContainerItems>
                <Field.Datepicker.MonthContainerItems>
                    {props.monthReference[props.month]}
                </Field.Datepicker.MonthContainerItems>
                <Field.Datepicker.MonthContainerItems onClick={e=>props.updateMonthDetails(props.year, props.month+1)}>
                    <FontAwesomeIcon icon='chevron-right'/>
                </Field.Datepicker.MonthContainerItems>
            </Field.Datepicker.MonthContainer>
        </div>
    )
}


const DatePickerCalendar = (props) => {
    const isCurrentMonth = (monthToCheck) => monthToCheck === props.month
    const isSelectedDay = (dayToCheck) => props.selectedDay.getDate() === dayToCheck.getDate() && props.selectedDay.getMonth() === dayToCheck.getMonth() && props.selectedDay.getFullYear() === dayToCheck.getFullYear()
    const isToday = (dayToCheck) => props.today.getDate() === dayToCheck.getDate() && props.today.getMonth() === dayToCheck.getMonth() && props.today.getFullYear() === dayToCheck.getFullYear()

    return (
        <Field.Datepicker.Table>
            <thead>
                <tr>
                {props.colGrid.map((_, index)=> (
                    <Field.Datepicker.WeekdaysContainer key={index}>
                        {props.dayOfTheWeekReference[index]}
                    </Field.Datepicker.WeekdaysContainer>
                ))}
                </tr>
            </thead>
            <tbody>
                {props.rowGrid.map((_, index)=> (
                    <tr key={index}>
                        {props.monthDates.slice(index*7, (index*7)+7).map((monthDate, index)=> (
                            <Field.Datepicker.DateContainer 
                            key={index} 
                            isCurrentMonth={isCurrentMonth(monthDate.getMonth())} 
                            isSelectedDay={isSelectedDay(monthDate)} 
                            isToday={isToday(monthDate)}
                            onClick={e=>{props.updateDate(monthDate)}}
                            >
                                {monthDate.getDate()}
                            </Field.Datepicker.DateContainer>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Field.Datepicker.Table>
    )
}


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
    const [month, setMonth] = useState(today.getMonth())
    const [year, setYear] = useState(today.getFullYear())
    const [monthDates, setMonthDates] = useState(getMonthDetails(year, month))
    const [translate3D, setTranslate3D] = useState(0)
    const [selectedDay, setSelectedDay] = useState(today)
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
                            <DatePickerHeader
                            month={month}
                            year={year}
                            monthReference={monthReference}
                            updateMonthDetails={updateMonthDetails}
                            />
                            <DatePickerCalendar
                            colGrid={colGrid}
                            rowGrid={rowGrid}
                            dayOfTheWeekReference={dayOfTheWeekReference}
                            monthDates={monthDates}
                            updateDate={updateDate}
                            month={month}
                            selectedDay={selectedDay}
                            today={today}
                            />
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