import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { View } from 'react-native'
import DateRangePicker from '../Utils/DateRangePicker'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { strings } from '../../utils/constants'
import sleep from '../../utils/sleep'
import dynamicImport from '../../utils/dynamicImport'
import { stringToJsDateFormat, jsDateToStringFormat } from '../../utils/dates'
import Styled from './styles'

const Spinner = dynamicImport('react-bootstrap', 'Spinner')

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
 * @param {Function} onAddNotification - This is a redux action to add notifications to the top of the page, here
 * we use to display if everything went wrong or right. 
 * @param {String} formName - the name of the formulary the user is in, we can get this from the url parameters.
 * @param {Object} params - the parameters of the listing, parameters define the filter, the sort, the date range
 * and many other stuff. This way we can extract the exact same data that is being displayed to the user.
 * @param {Function} onExportData - a function to call the backend and require a file to be produced, this is an async function
 * so we make the request without getting any response
 * @param {Function} onGetExportedData - after making a request we expect this function to redirect us to the url to download 
 * the generated file after the file is ready.
 */
const ListingExtract = (props) => {
    const start = moment().subtract(59, 'days').toDate()
    const end = moment().toDate()
    const [updateDates, setUpdateDates] = useState({
        startDate: jsDateToStringFormat(start, props.dateFormat.split(' ')[0]),
        endDate: jsDateToStringFormat(end, props.dateFormat.split(' ')[0])
    })
    const [isExtracting, setIsExtracting] = useState(false)
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
    
    const onGetExportData = async (fileId) => {
        let response = await props.onGetExportedData(props.formName, fileId)
        let counter = 0
        // try to extract for 2 minutes, otherwise it doesn't extract
        while (response.data.status === 'empty' && counter < 60) {
            await sleep(2000);
            response = await props.onGetExportedData(props.formName, fileId)
            counter = (response.data.status !== 'empty') ? 61 : counter + 1
            if (counter === 60) {
                props.onAddNotification(strings['pt-br']['listingExtractTimeoutError'], 'error')
            }
        }
        setIsExtracting(false)
    }

    const onExtract = (format) => {
        const data = {
            ...props.params,
            from_date: updateDates.startDate,
            to_date: updateDates.endDate,
            format: format
        }
        props.onExportData(data, props.formName).then(response => {   
            if (response && response.data.status === 'ok') {
                setIsExtracting(true)
                const fileId = response.data.data.file_id
                onGetExportData(fileId)
            }
        })
    }

    const onChangeUpdateDate = (dates) => {
        updateDates.startDate = (dates[0] !== '') ? jsDateToStringFormat(dates[0], props.dateFormat.split(' ')[0]) : dates[0]
        updateDates.endDate = (dates[1] !== '') ? jsDateToStringFormat(dates[1], props.dateFormat.split(' ')[0]) : dates[1]
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
        updateDates.startDate !== '' ? stringToJsDateFormat(updateDates.startDate, props.dateFormat.split(' ')[0]) : '', 
        updateDates.endDate !== '' ? stringToJsDateFormat(updateDates.endDate, props.dateFormat.split(' ')[0]) : ''
    ]

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <Styled.ListingFilterAndExtractContainer 
            ref={dropdownRef}
            hasLeftMargin={true}
            >
                <Styled.ListingFilterAndExtractButton 
                onClick={e => {onToggleExtract(e)}}
                >
                    {strings['pt-br']['listingExtractButtonLabel']}
                </Styled.ListingFilterAndExtractButton>
                {isOpen ? ( 
                    <Styled.ListingExtractContainer>
                        <div>
                            <Styled.ListingExtractUpdateDateTitle>
                                {strings['pt-br']['listingExtractUpdateDateLabel']}
                            </Styled.ListingExtractUpdateDateTitle>
                            <Styled.ListingExtractUpdateDateContainer 
                            ref={inputRef}
                            >
                                <Styled.ListingExtractUpdateDateInput 
                                type="text" 
                                value={value} 
                                readOnly={true}
                                />
                                <FontAwesomeIcon icon="chevron-down"/>
                            </Styled.ListingExtractUpdateDateContainer>
                            <DateRangePicker 
                            input={inputRef} 
                            closeWhenSelected={true}
                            onChange={onChangeUpdateDate} 
                            initialDays={initialDays}
                            />
                            <Styled.ListingExtractButtons 
                            onClick={e=> {isExtracting ? null : onExtract('csv')}}
                            >
                                {isExtracting ? (
                                    <Spinner animation="border" size="sm"/>
                                ) : (
                                    <FontAwesomeIcon icon="arrow-down"/>
                                )}
                                {strings['pt-br']['listingExtractCSVButtonLabel']}
                            </Styled.ListingExtractButtons>
                            <Styled.ListingExtractButtons 
                            onClick={e=> {isExtracting ? null : onExtract('xlsx')}}
                            >
                                {isExtracting ? (
                                    <Spinner animation="border" size="sm"/>
                                ) : (
                                    <FontAwesomeIcon icon="arrow-down"/>
                                )}
                                {strings['pt-br']['listingExtractXLSXButtonLabel']}
                            </Styled.ListingExtractButtons>
                        </div>
                    </Styled.ListingExtractContainer>
                ) : ''}
            </Styled.ListingFilterAndExtractContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default ListingExtract