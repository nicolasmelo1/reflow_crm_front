import React from 'react'
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
                <Utils.Datepicker.YearContainerItems onClick={e=>props.updateMonthDetails(props.year-1, props.month, props.selectedDay.getHours(), props.selectedDay.getMinutes())}>
                    <FontAwesomeIcon icon='chevron-left'/>
                </Utils.Datepicker.YearContainerItems>
                <Utils.Datepicker.YearContainerItems>
                    {props.year}
                </Utils.Datepicker.YearContainerItems>
                <Utils.Datepicker.YearContainerItems onClick={e=>props.updateMonthDetails(props.year+1, props.month, props.selectedDay.getHours(), props.selectedDay.getMinutes())}>
                    <FontAwesomeIcon icon='chevron-right'/>
                </Utils.Datepicker.YearContainerItems>
            </Utils.Datepicker.YearContainer>
            <Utils.Datepicker.MonthContainer>
                <Utils.Datepicker.MonthContainerItems onClick={e=>props.updateMonthDetails(props.year, props.month-1, props.selectedDay.getHours(), props.selectedDay.getMinutes())}>
                    <FontAwesomeIcon icon='chevron-left'/>
                </Utils.Datepicker.MonthContainerItems>
                <Utils.Datepicker.MonthContainerItems>
                    {props.monthReference[props.month]}
                </Utils.Datepicker.MonthContainerItems>
                <Utils.Datepicker.MonthContainerItems onClick={e=>props.updateMonthDetails(props.year, props.month+1, props.selectedDay.getHours(), props.selectedDay.getMinutes())}>
                    <FontAwesomeIcon icon='chevron-right'/>
                </Utils.Datepicker.MonthContainerItems>
            </Utils.Datepicker.MonthContainer>
        </div>
    )
}


/**
 * Contains all of the logic for the calendar table with the month numbers.
 * IMPORTANT: Use only inside this file
 * @param {function} updateDate - Main fuction to call to update the selected date.
 * @param {Array<Integer>} colGrid - An array containing with the number of elements as the number of columns, so we can loop with .map()
 * @param {Array<Integer>} rowGrid - An array containing with the number of elements as the number of rows, so we can loop with .map()
 * @param {Array<Date>} monthDates - An array contining all the dates to display
 * @param {Date} today - The current date
 * @param {Date} selectedDay - The current selected day by the user
 * @param {Integer} month - The current month number
 * @param {Array<String>} dayOfTheWeekReference - The array containing the name of the day of the week to display instead of the number
 */
const DatePickerCalendar = (props) => {
    const isCurrentMonth = (monthToCheck) => monthToCheck === props.month
    const isSelectedDay = (dayToCheck) => props.selectedDay.getDate() === dayToCheck.getDate() && props.selectedDay.getMonth() === dayToCheck.getMonth() && props.selectedDay.getFullYear() === dayToCheck.getFullYear()
    const isToday = (dayToCheck) => props.today.getDate() === dayToCheck.getDate() && props.today.getMonth() === dayToCheck.getMonth() && props.today.getFullYear() === dayToCheck.getFullYear()

    return (
        <Utils.Datepicker.Table>
            <thead>
                <tr>
                {props.colGrid.map((_, index)=> (
                    <Utils.Datepicker.WeekdaysContainer key={index}>
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
                            isCurrentMonth={isCurrentMonth(monthDate.getMonth())} 
                            isSelectedDay={isSelectedDay(monthDate)} 
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
 * @param {function} updateMonthDetails - update month Details is the main function to update the month and year
 * details in the calendar, this function is defined on DateTimePicker component.
 * @param {function} updateDate - Main fuction to call to update the selected date.
 * @param {Integer} cols - number of cols
 * @param {Integer} rows - number of rows
 * @param {Array<String>} monthReference - The array containing the name of the month to display instead of the number
 * @param {Array<Date>} monthDates - An array contining all the dates to display
 * @param {Date} today - The current date
 * @param {Date} selectedDay - The current selected day by the user
 * @param {Integer} month - The current month number
 * @param {Integer} year - The current Year number
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
            <DatePickerHeader
            month={props.month}
            year={props.year}
            selectedDay={props.selectedDay}
            monthReference={props.monthReference}
            updateMonthDetails={props.updateMonthDetails}
            />
            <DatePickerCalendar
            colGrid={colGrid}
            rowGrid={rowGrid}
            dayOfTheWeekReference={props.dayOfTheWeekReference}
            monthDates={props.monthDates}
            updateDate={props.updateDate}
            month={props.month}
            selectedDay={props.selectedDay}
            today={props.today}
            />
        </div>
    )           
}

export default DatePicker