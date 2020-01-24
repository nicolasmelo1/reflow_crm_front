import React, { useState, useEffect } from 'react'
import { Field } from 'styles/Formulary'

const DatePicker = (props) => {
    const oneDay = 60 * 60 * 24 * 1000;
    const todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);
    const [isOpen, _setIsOpen] = useState(false)
    
    const getMonthDetails = (year, month) => {
        const firstDay = (new Date(year, month)).getDay();
        //const numberOfDays = this.getNumberOfDays(year, month);
        let monthArray = [];
        let rows = 6;
        let currentDay = null;
        let index = 0; 
        let cols = 7;

        for(let row=0; row<rows; row++) {
            for(let col=0; col<cols; col++) { 
                console.log(index)
                console.log(firstDay)
                console.log(year)
                console.log(month)
                monthArray.push(currentDay);
                index++;
            }
        }
        return monthArray;
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

    const [datePickerData, setDatePickerData] = useState(()=> {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        return {
            year,
            month,
            selectedDay: todayTimestamp,
            monthDetails: getMonthDetails(year, month)
        }
    })

    return (
        <div style={{position:'relative'}}>
            {isOpen ? (
                <Field.Datepicker.PickerContainer>
                </Field.Datepicker.PickerContainer>
            ): ''}
        </div>
    )
    
}

export default DatePicker