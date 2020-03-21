import React, { useEffect } from 'react'
import Utils from 'styles/Utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Contains the header components of the calendar component. In this header we display
 * the year with the navigation arrows and the month with the navigation arrows.
 * IMPORTANT: Use only inside this file
 * @param {function} updateMonthDetails - update month Details is the main function to update the month and year
 * details in the calendar, this function is defined on DateTimePicker component. This updates the monthDetails array.
 * @param {Date} selectedDay - The current selected day by the user
 * @param {Integer} month - The current month number
 * @param {Array<String>} monthReference - The array containing the name of the month to display instead of the number
 * @param {Integer} year - The current Year number
 */
const DatePickerHeader = (props) => {
    return (
        <div>
            <Utils.Datepicker.YearContainer>
                <Utils.Datepicker.YearContainerItems onClick={e=>props.updateMonthDetails(props.year-1, props.month, props.selectedDays[0].getHours(), props.selectedDays[0].getMinutes())}>
                    <FontAwesomeIcon icon='chevron-left'/>
                </Utils.Datepicker.YearContainerItems>
                <Utils.Datepicker.YearContainerItems>
                    {props.year}
                </Utils.Datepicker.YearContainerItems>
                <Utils.Datepicker.YearContainerItems onClick={e=>props.updateMonthDetails(props.year+1, props.month, props.selectedDays[0].getHours(), props.selectedDays[0].getMinutes())}>
                    <FontAwesomeIcon icon='chevron-right'/>
                </Utils.Datepicker.YearContainerItems>
            </Utils.Datepicker.YearContainer>
            <Utils.Datepicker.MonthContainer>
                <Utils.Datepicker.MonthContainerItems onClick={e=>props.updateMonthDetails(props.year, props.month-1, props.selectedDays[0].getHours(), props.selectedDays[0].getMinutes())}>
                    <FontAwesomeIcon icon='chevron-left'/>
                </Utils.Datepicker.MonthContainerItems>
                <Utils.Datepicker.MonthContainerItems>
                    {props.monthReference[props.month]}
                </Utils.Datepicker.MonthContainerItems>
                <Utils.Datepicker.MonthContainerItems onClick={e=>props.updateMonthDetails(props.year, props.month+1, props.selectedDays[0].getHours(), props.selectedDays[0].getMinutes())}>
                    <FontAwesomeIcon icon='chevron-right'/>
                </Utils.Datepicker.MonthContainerItems>
            </Utils.Datepicker.MonthContainer>
        </div>
    )
}


/**
 * Contains all of the logic for the calendar table with the month numbers.
 * It`s important to notice we have different logics one if it is a DateRangePicker, the other if it is a DatePicker.
 * Daterangepicker needs to change colors on hover, so most of the logic here is regarding this issue. Checks `onMouseMove`
 * IMPORTANT: Use only inside this file
 * @param {function} updateDate - Main fuction to call to update the selected date.
 * @param {Array<Integer>} colGrid - An array containing with the number of elements as the number of columns, so we can loop with .map()
 * @param {Array<Integer>} rowGrid - An array containing with the number of elements as the number of rows, so we can loop with .map()
 * @param {Array<Date>} monthDates - An array contining all the dates to display
 * @param {Date} today - The current date
 * @param {reactRef} containerRef - (optional) - You use this if you are building a dateRangePicker, because we need to change the colors of 
 * all of the `td` tags in a container
 * @param {Array<Date>} selectedDays - The current selected days by the user
 * @param {Boolean} isDarkBackground - If the background is dark change the colors accordingly
 * @param {Integer} month - The current month number
 * @param {Array<String>} dayOfTheWeekReference - The array containing the name of the day of the week to display instead of the number
 */
const DatePickerCalendar = (props) => {
    const dateTableRef = React.useRef(null)
    const selectedDaysRef = React.useRef(props.selectedDays)
    const biggestDate = ![null, '', undefined].includes(selectedDaysRef.current[selectedDaysRef.current.length-1]) ? Date.UTC(selectedDaysRef.current[selectedDaysRef.current.length-1].getFullYear(), selectedDaysRef.current[selectedDaysRef.current.length-1].getMonth(), selectedDaysRef.current[selectedDaysRef.current.length-1].getDate()) : -1
    const lowestDate = ![null, '', undefined].includes(selectedDaysRef.current[0]) ? Date.UTC(selectedDaysRef.current[0].getFullYear(), selectedDaysRef.current[0].getMonth(), selectedDaysRef.current[0].getDate()) : -1
    const dateDifference = (biggestDate !== -1 && lowestDate !== -1) ? Math.floor((biggestDate - lowestDate)/(1000 * 60 * 60 * 24)) : 0
    
    const getBetweenDates = (dateDifference, firstDate) => {
        return (dateDifference> 0) ? Array.apply(null, Array(dateDifference)).map((_, i) => {
            return new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate()+i, firstDate.getHours(), firstDate.getMinutes())
        }) : []
    }
    const isCurrentMonth = (monthToCheck) => monthToCheck === props.month
    const isSelectedDay = (dayToCheck) => selectedDaysRef.current.find(selectedDay => typeof selectedDay === 'object' && selectedDay.getDate() === dayToCheck.getDate() && selectedDay.getMonth() === dayToCheck.getMonth() && selectedDay.getFullYear() === dayToCheck.getFullYear()) !== undefined
    const inBetweenDate = (dayToCheck, betweenDates) => betweenDates.find(betweenDay => betweenDay.getDate() === dayToCheck.getDate() && betweenDay.getMonth() === dayToCheck.getMonth() && betweenDay.getFullYear() === dayToCheck.getFullYear()) !== undefined
    const isToday = (dayToCheck) => props.today.getDate() === dayToCheck.getDate() && props.today.getMonth() === dayToCheck.getMonth() && props.today.getFullYear() === dayToCheck.getFullYear()

    if (props.containerRef) {
        props.containerRef.current.querySelectorAll('td').forEach(dateElement=> {
            dateElement.removeAttribute("style")
        })
    }

    const onMouseMove = (e) => {
        e.preventDefault()
        const elementDate = new Date(e.target.dataset.date)
        if (props.containerRef && e.target.tagName === 'TD' && selectedDaysRef.current[0] !== '' && selectedDaysRef.current[1] === '' && selectedDaysRef.current.length > 1 && lowestDate && elementDate > lowestDate) {
            const dateDifference = Math.floor((elementDate - lowestDate)/(1000 * 60 * 60 * 24))
            
            props.containerRef.current.querySelectorAll('td').forEach(dateElement=> {
                const date = new Date(dateElement.dataset.date)
                if(inBetweenDate(date, getBetweenDates(dateDifference, selectedDaysRef.current[0])) && !isSelectedDay(date) && JSON.parse(dateElement.dataset.isCurrentMonth)) {
                    dateElement.style.backgroundColor='#bfbfbf'
                } else {
                    dateElement.removeAttribute("style")
                }
            })
        }
    }

    useEffect(() => {
        selectedDaysRef.current = props.selectedDays
    }, [props.selectedDays])

    useEffect(() => {
        if (props.containerRef) {
            dateTableRef.current.addEventListener("mousemove", onMouseMove)
            return () => {
                dateTableRef.current.removeEventListener("mousemove", onMouseMove)
            }
        }
    })

    return (
        <Utils.Datepicker.Table ref={dateTableRef}>
            <thead>
                <tr>
                {props.colGrid.map((_, index)=> (
                    <Utils.Datepicker.WeekdaysContainer isDarkBackground={props.isDarkBackground} key={index}>
                        {props.dayOfTheWeekReference[index]}
                    </Utils.Datepicker.WeekdaysContainer>
                ))}
                </tr>
            </thead>
            <tbody>
                {props.rowGrid.map((_, index)=> (
                    <tr key={index}>
                        {props.monthDates.slice(index*7, (index*7)+7).map((monthDate, index)=> (
                            <Utils.Datepicker.DateContainer 
                            key={index} 
                            data-date={monthDate}
                            data-is-current-month={isCurrentMonth(monthDate.getMonth())}
                            isCurrentMonth={isCurrentMonth(monthDate.getMonth())} 
                            isDarkBackground={props.isDarkBackground}
                            isSelectedDay={isSelectedDay(monthDate)} 
                            inBetweenDate={inBetweenDate(monthDate, getBetweenDates(dateDifference, props.selectedDays[0]))}
                            isToday={isToday(monthDate)}
                            onClick={e=>{props.updateDate(monthDate)}}
                            >
                                {monthDate.getDate()}
                            </Utils.Datepicker.DateContainer>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Utils.Datepicker.Table>
    )
}

/**
 * Main component of the calendar type visualization, import this and use this on DateTimePicker component.
 * We only export this in this file.
 * @param {function} updateMonthDetails - (optional: only if `withoutHeader` is True) - update month Details is the main function to update the month and year
 * details in the calendar, this function is defined on DateTimePicker component.
 * @param {function} updateDate - Main fuction to call to update the selected date.
 * @param {Integer} cols - number of cols
 * @param {Integer} rows - number of rows
 * @param {Array<String>} monthReference - (optional: only if `withoutHeader` is True) - The array containing the name of the month to display instead of the number
 * @param {Array<Date>} monthDates - An array contining all the dates to display
 * @param {Date} today - The current date
 * @param {Array<Date>} selectedDays - The current selected day by the user
 * @param {Integer} month - The current month number
 * @param {Integer} year - (optional: only if `withoutHeader` is True) - The current Year number
 * @param {Boolean} isDarkBackground - If the background is dark change the colors accordingly
 * @param {Boolean} withoutHeader - if TRUE doesn't show the header of the calendar
 * @param {Boolean} withoutHourPicker - if TRUE doesn't show the button to toggle to the hourpicker
 * @param {function} setHourPickerIsOpen - function to call to set the state of the hourPickerIsOpen
 * @param {Array<String>} dayOfTheWeekReference - The array containing the name of the day of the week to display instead of the number
 */
const DatePicker = (props) => {
    const rowGrid = Array.apply(null, Array(props.rows)).map((_, i) => i)
    const colGrid = Array.apply(null, Array(props.cols)).map((_, i) => i)

    return (
        <div>
            {props.withoutHourPicker ? '' : (
                <Utils.Datepicker.HourpickerDatepickerToggle onClick={e=>{props.setHourPickerIsOpen(true)}}>
                    <FontAwesomeIcon icon="clock"/>
                </Utils.Datepicker.HourpickerDatepickerToggle>
            )}
            {props.withoutHeader ? '' : (
                <DatePickerHeader
                month={props.month}
                year={props.year}
                selectedDays={props.selectedDays}
                monthReference={props.monthReference}
                updateMonthDetails={props.updateMonthDetails}
                />
            )}
            <DatePickerCalendar
            isDarkBackground={props.isDarkBackground}
            colGrid={colGrid}
            rowGrid={rowGrid}
            dayOfTheWeekReference={props.dayOfTheWeekReference}
            monthDates={props.monthDates}
            containerRef={props.containerRef}
            updateDate={props.updateDate}
            month={props.month}
            selectedDays={props.selectedDays}
            today={props.today}
            />
        </div>
    )           
}

export default DatePicker