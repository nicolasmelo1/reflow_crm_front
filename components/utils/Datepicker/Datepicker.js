import React from 'react'
import { Field } from 'styles/Formulary'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const DatePickerHeader = (props) => {
    return (
        <div>
            <Field.Datepicker.YearContainer>
                <Field.Datepicker.YearContainerItems onClick={e=>props.updateMonthDetails(props.year-1, props.month, props.selectedDay.getHours(), props.selectedDay.getMinutes())}>
                    <FontAwesomeIcon icon='chevron-left'/>
                </Field.Datepicker.YearContainerItems>
                <Field.Datepicker.YearContainerItems>
                    {props.year}
                </Field.Datepicker.YearContainerItems>
                <Field.Datepicker.YearContainerItems onClick={e=>props.updateMonthDetails(props.year+1, props.month, props.selectedDay.getHours(), props.selectedDay.getMinutes())}>
                    <FontAwesomeIcon icon='chevron-right'/>
                </Field.Datepicker.YearContainerItems>
            </Field.Datepicker.YearContainer>
            <Field.Datepicker.MonthContainer>
                <Field.Datepicker.MonthContainerItems onClick={e=>props.updateMonthDetails(props.year, props.month-1, props.selectedDay.getHours(), props.selectedDay.getMinutes())}>
                    <FontAwesomeIcon icon='chevron-left'/>
                </Field.Datepicker.MonthContainerItems>
                <Field.Datepicker.MonthContainerItems>
                    {props.monthReference[props.month]}
                </Field.Datepicker.MonthContainerItems>
                <Field.Datepicker.MonthContainerItems onClick={e=>props.updateMonthDetails(props.year, props.month+1, props.selectedDay.getHours(), props.selectedDay.getMinutes())}>
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
    const rowGrid = Array.apply(null, Array(props.rows)).map((_, i) => i)
    const colGrid = Array.apply(null, Array(props.cols)).map((_, i) => i)

    return (
        <div>
            <Field.Datepicker.HourpickerDatepickerToggle onClick={e=>{props.setHourPickerIsOpen(true)}}>
                <FontAwesomeIcon icon="clock"/>
            </Field.Datepicker.HourpickerDatepickerToggle>
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