import React, { useState, useEffect } from 'react'
import DatePicker from './DateTimePicker/DatePicker'
import Utils from 'styles/Utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const DateRangePicker = (props) => {
    const rows = 6
    const cols = 7
    const dateGridLength = cols*rows
    const today = new Date()
    const dayOfTheWeekReference = props.dayOfTheWeekReference || ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const monthReference = props.monthReference || ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const withoutHourPicker = props.withoutHourPicker || false 

    const [isOpen, _setIsOpen] = useState(false)
    const [firstMonth, setFirstMonth] = useState(today.getMonth())
    const [firstYear, setFirstYear] = useState(today.getFullYear())
    const [secondMonth, setSecondMonth] = useState(today.getMonth()+1)
    const [secondYear, setSecondYear] = useState(secondMonth>11 ? today.getFullYear() +1 : today.getFullYear())
    const [firstMonthDates, setFirstMonthDates] = useState(getMonthDetails(firstYear, firstMonth, today.getHours(), today.getMinutes()))
    const [secondMonthDates, setSecondMonthDates] = useState(getMonthDetails(secondYear, secondMonth, today.getHours(), today.getMinutes()))
    const [translate3D, setTranslate3D] = useState(0)
    const [selectedDays, setSelectedDays] = useState(['', ''])
    const [hourPickerIsOpen, setHourPickerIsOpen] = useState(false)

    const dateRangePickerContainerRef = React.useRef(null)
    const dateRangePickerRef = React.useRef(null);

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
            const dayOfTheWeek = index - monthDayOfTheWeekStart; 
            const date = new Date(year, month, dayOfTheWeek+1, hour, minute)
            monthArray.push(date)
        }
        return monthArray
    }
    
    const updateMonthDetails = (year, month, hour, minute) => {
        let firstMonth = month
        let firstYear = year
        let secondMonth = month+1
        let secondYear = year
        
        if (firstMonth<0) {
            firstYear = firstYear - 1
            firstMonth = 11
        } else if (firstMonth>11){
            firstYear = firstYear + 1
            firstMonth = firstMonth - 12
        }
        if (secondMonth<0) {
            secondYear = secondYear - 1
            secondMonth = 11
        } else if (secondMonth>11){
            secondYear = secondYear + 1
            secondMonth = secondMonth - 12
        }

        const firstMonthDetails = getMonthDetails(firstYear, firstMonth, hour, minute)
        const secondMonthDetails = getMonthDetails(secondYear, secondMonth, hour, minute)
        setFirstMonth(firstMonth)
        setFirstYear(firstYear)
        setSecondMonth(secondMonth)
        setSecondYear(secondYear)
        setFirstMonthDates(firstMonthDetails)
        setSecondMonthDates(secondMonthDetails)
    }

    const updateDate = (date) => {
        if (selectedDays[0] === '' || date < selectedDays[0] || selectedDays[1] !== '') {
            selectedDays[0] = date
            selectedDays[1] = ''
        } else {
            selectedDays[1] = date
        }
        setSelectedDays([...selectedDays])
        if (props.onChange){
            props.onChange(date)
        }
    }

    const onInputClick = (e) => {
        e.stopPropagation();
        if ((props.input.current && props.input.current.contains(e.target)) || (dateRangePickerRef.current && dateRangePickerRef.current.contains(e.target))) {
            setIsOpen(true)
            topOrDown(e)
        } else if (isOpenRef.current) {
            setIsOpen(false)
        }
    }

    const topOrDown = (e) => {
        e.preventDefault()
        if(dateRangePickerRef.current){
            const rect = dateRangePickerContainerRef.current.getBoundingClientRect();
            if (rect.top+dateRangePickerRef.current.offsetHeight>window.innerHeight){
                setTranslate3D(-dateRangePickerRef.current.offsetHeight-props.input.current.offsetHeight)
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
        //setStartSelectedDay(dateToConsider)
        updateMonthDetails(dateToConsider.getFullYear(), dateToConsider.getMonth(), dateToConsider.getHours(), dateToConsider.getMinutes())
    }, [props.initialDay])

    return(
        <Utils.Daterangepicker.Holder ref={dateRangePickerContainerRef}>
            {isOpen ? (
                <Utils.Daterangepicker.Container ref={dateRangePickerRef}>
                    <Utils.Daterangepicker.DatePickerContainer>
                        <Utils.Daterangepicker.Header>
                            <thead>
                                <tr>
                                    <Utils.Daterangepicker.HeaderElement>
                                        <Utils.Daterangepicker.HeaderButton onClick={e=> {
                                            updateMonthDetails(firstYear, firstMonth-1, selectedDays[0] !== '' ? selectedDays[0].getHours() : today.getHours(), selectedDays[0] !== '' ? selectedDays[0].getMinutes() : today.getMinutes())
                                        }}>
                                            <FontAwesomeIcon icon="chevron-left"/>
                                        </Utils.Daterangepicker.HeaderButton>
                                    </Utils.Daterangepicker.HeaderElement>
                                    <Utils.Daterangepicker.HeaderElement colSpan={"5"}>
                                        {monthReference[firstMonth] + " " + firstYear}
                                    </Utils.Daterangepicker.HeaderElement>
                                    <Utils.Daterangepicker.HeaderElement/>
                                </tr>
                            </thead>
                        </Utils.Daterangepicker.Header>
                        <DatePicker 
                        dayOfTheWeekReference={dayOfTheWeekReference}
                        setHourPickerIsOpen={setHourPickerIsOpen}
                        containerRef={dateRangePickerContainerRef}
                        withoutHourPicker={true}
                        withoutHeader={true}
                        selectedDays={selectedDays}
                        monthDates={firstMonthDates}
                        updateDate={updateDate}
                        today={today}
                        month={firstMonth}
                        rows={rows}
                        cols={cols}
                        />
                    </Utils.Daterangepicker.DatePickerContainer>
                    <Utils.Daterangepicker.DatePickerContainer>
                        <Utils.Daterangepicker.Header>
                            <thead>
                                <tr>
                                    <Utils.Daterangepicker.HeaderElement/>
                                    <Utils.Daterangepicker.HeaderElement colSpan={"5"}>
                                        {monthReference[secondMonth] + " " + secondYear}
                                    </Utils.Daterangepicker.HeaderElement>
                                    <Utils.Daterangepicker.HeaderElement>
                                        <Utils.Daterangepicker.HeaderButton onClick={e=> {
                                            updateMonthDetails(firstYear, firstMonth+1, selectedDays[1] !== '' ? selectedDays[1].getHours() : today.getHours(), selectedDays[1] !== '' ? selectedDays[1].getMinutes() : today.getMinutes())
                                        }}>
                                            <FontAwesomeIcon icon="chevron-right"/>
                                        </Utils.Daterangepicker.HeaderButton>
                                    </Utils.Daterangepicker.HeaderElement>
                                </tr>
                            </thead>
                        </Utils.Daterangepicker.Header>
                        <DatePicker 
                        dayOfTheWeekReference={dayOfTheWeekReference}
                        setHourPickerIsOpen={setHourPickerIsOpen}
                        containerRef={dateRangePickerContainerRef}
                        withoutHourPicker={true}
                        withoutHeader={true}
                        selectedDays={selectedDays}
                        monthDates={secondMonthDates}
                        updateDate={updateDate}
                        today={today}
                        month={secondMonth}
                        rows={rows}
                        cols={cols}
                        />
                    </Utils.Daterangepicker.DatePickerContainer>
                </Utils.Daterangepicker.Container>
            ): ''}
        </Utils.Daterangepicker.Holder>
    )
}

export default DateRangePicker