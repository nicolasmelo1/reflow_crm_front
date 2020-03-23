import React, { useState, useEffect } from 'react';
import { ListingFilterAndExtractContainer, ListingFilterAndExtractButton, ListingExtractContainer, ListingExtractUpdateDateTitle, ListingExtractUpdateDateInput, ListingExtractButtons, ListingExtractUpdateDateContainer} from 'styles/Listing'
import DateRangePicker from 'components/Utils/DateRangePicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { strings } from 'utils/constants'
import sleep from 'utils/sleep'
import { stringToJsDateFormat, jsDateToStringFormat } from 'utils/dates'
import moment from 'moment'

/**
 * This component renders the extract button and it's small formulary
 * All of the logic for extracting the data to a file is handled by this component.
 * It's important to notice it is not responsible anymore when the user changes the page he is in.
 * 
 * By default we need to limit the data the user can extract, so we need to define a maximum and a minimum update
 * date of the formulary, so any formulary that has been updated between this dates will be extracted, by default
 * when the user renders this component we give him a range of 60 days starting on the current date.
 * 
 * ATENTION: Be aware of the dateFormat, we are using right now 'DD/MM/YYYY' but we want in the near future for 
 * the user to be able to select a default date format for his system.
 * @param {String} formName - the name of the formulary the user is in, we can get this from the url parameters.
 * @param {Object} params - the parameters of the listing, parameters define the filter, the sort, the date range
 * and many other stuff. This way we can extract the exact same data that is being displayed to the user.
 * @param {Function} onExportData - a function to call the backend and require a file to be produced, this is an async function
 * so we make the request without getting any response
 * @param {Function} onGetExportedData - after making a request we expect this function to redirect us to the url to download 
 * the generated file after the file is ready.
 */
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
        props.onExportData(data, props.formName).then(async response => {   
            if (response.data.status === 'ok') {
                let response = await props.onGetExportedData()
                let counter = 0
                while (response.data.status === 'empty' || counter !== 100) {
                    await sleep(2000);
                    response = await props.onGetExportedData()
                    counter++
                }
            }
        })
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
        <ListingFilterAndExtractContainer hasLeftMargin={true} ref={dropdownRef}>
            <ListingFilterAndExtractButton onClick={e => {onToggleExtract(e)}}>
                {strings['pt-br']['listingExtractButtonLabel']}
            </ListingFilterAndExtractButton>
            {isOpen ? ( 
                <ListingExtractContainer>
                    <div>
                        <ListingExtractUpdateDateTitle>{strings['pt-br']['listingExtractUpdateDateLabel']}</ListingExtractUpdateDateTitle>
                        <ListingExtractUpdateDateContainer ref={inputRef}>
                            <ListingExtractUpdateDateInput type="text" value={value} readOnly={true}/><FontAwesomeIcon icon="chevron-down"/>
                        </ListingExtractUpdateDateContainer>
                        <DateRangePicker input={inputRef} 
                        closeWhenSelected={true}
                        onChange={onChangeUpdateDate} 
                        initialDays={initialDays}
                        />
                        <ListingExtractButtons onClick={e=> {onExtract('csv')}}>
                            <FontAwesomeIcon icon="arrow-down"/>{strings['pt-br']['listingExtractCSVButtonLabel']}
                        </ListingExtractButtons>
                        <ListingExtractButtons onClick={e=> {onExtract('xlsx')}}>
                            <FontAwesomeIcon icon="arrow-down"/>{strings['pt-br']['listingExtractXLSXButtonLabel']}
                        </ListingExtractButtons>
                    </div>
                </ListingExtractContainer>
            ) : ''}
        </ListingFilterAndExtractContainer>
    )
}

export default ListingExtract;