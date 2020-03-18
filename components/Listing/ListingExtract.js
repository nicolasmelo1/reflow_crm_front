import React, { useState, useEffect } from 'react';
import { ListingFilterButton, ListingExtractContainer, ListingExtractUpdateDateTitle, ListingExtractUpdateDateInput, ListingExtractButtons, ListingExtractUpdateDateContainer} from 'styles/Listing'
import DateRangePicker from 'components/Utils/DateRangePicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { strings } from 'utils/constants'
import { stringToJsDateFormat, jsDateToStringFormat } from 'utils/dates'
import moment from 'moment'

const ListingExtract = (props) => {
    const dateFormat = 'DD/MM/YYYY'

    const start = moment().subtract(59, 'days').toDate();
    const end = moment().toDate();    
    const [updateDates, setUpdateDates] = useState({
        startDate: jsDateToStringFormat(start, dateFormat),
        endDate: jsDateToStringFormat(end, dateFormat)
    })
    const [value, setValue] = useState(updateDates.startDate + " - " + updateDates.endDate)
    const [isOpen, _setIsOpen] = useState(false)

    const dropdownRef = React.useRef()
    const inputRef = React.useRef()

    // Check Components/Utils/Select for reference and explanation
    const setIsOpenRef = React.useRef(isOpen);
    const setIsOpen = data => {
        setIsOpenRef.current = data;
        _setIsOpen(data);
    }
    
    const onExtract = (format) => {
        const data = {
            ...props.params,
            from: updateDates.startDate,
            to: updateDates.endDate,
            format: format
        }
        console.log(data)
    }

    const onChangeUpdateDate = (dates) => {
        updateDates.startDate = (dates[0] !== '') ? jsDateToStringFormat(dates[0], dateFormat) : dates[0]
        updateDates.endDate = (dates[1] !== '') ? jsDateToStringFormat(dates[1], dateFormat) : dates[1]
        if (updateDates.startDate !== '' && updateDates.endDate !== '') {
            setValue(updateDates.startDate + " - " + updateDates.endDate)
        }
        setUpdateDates({...updateDates})
    }

    const onToggleExtract = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen)
    }

    const onToggleFilterOnClickOutside = (e) => {
        e.stopPropagation();
        if (dropdownRef.current && !dropdownRef.current.contains(e.target) && setIsOpenRef.current) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", onToggleFilterOnClickOutside); 
        return () => {
            document.removeEventListener("mousedown", onToggleFilterOnClickOutside);
        };
    }, [onToggleFilterOnClickOutside]);

    const initialDays = [
        updateDates.startDate !== '' ? stringToJsDateFormat(updateDates.startDate, dateFormat) : '', 
        updateDates.endDate !== '' ? stringToJsDateFormat(updateDates.endDate, dateFormat) : ''
    ]

    return (
        <div style={{position:'relative', display: 'inline-block'}} ref={dropdownRef}>
            <ListingFilterButton onClick={e => {onToggleExtract(e)}}>
                Extrair
            </ListingFilterButton>
            {isOpen ? ( 
                <ListingExtractContainer>
                    <div>
                        <ListingExtractUpdateDateTitle>Data de atualização</ListingExtractUpdateDateTitle>
                        <ListingExtractUpdateDateContainer ref={inputRef}>
                            <ListingExtractUpdateDateInput type="text" value={value} readOnly={true}/><FontAwesomeIcon icon="chevron-down"/>
                        </ListingExtractUpdateDateContainer>
                        <DateRangePicker input={inputRef} 
                        closeWhenSelected={true}
                        onChange={onChangeUpdateDate} 
                        initialDays={initialDays}
                        />
                        <ListingExtractButtons onClick={e=> {onExtract('csv')}}>
                            <FontAwesomeIcon icon="arrow-down"/>.csv
                        </ListingExtractButtons>
                        <ListingExtractButtons onClick={e=> {onExtract('xlsx')}}>
                            <FontAwesomeIcon icon="arrow-down"/>.xlsx
                        </ListingExtractButtons>
                    </div>
                </ListingExtractContainer>
            ) : ''}
        </div>
    )
}

export default ListingExtract;