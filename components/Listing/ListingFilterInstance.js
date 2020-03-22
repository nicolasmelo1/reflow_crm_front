import React, { useState, useEffect } from 'react'
import { ListingFilterInputGroup, ListingFilterInputDropdownButton, ListingFilterInput, ListingFilterDeleteButton } from 'styles/Listing'
import { Dropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { strings } from 'utils/constants'

/**
 * Holds the data of a single filter, we can have multiple filters, but this holds just one filter
 * instance.
 * 
 * @param {Object} headers - object containing primarly all of the fields in the header. we use this array
 * to construct all of the field options he can select or unselect to filter.
 * @param {BigInteger} index - the index of the filter instance. Since we can have multiple filter intances
 * we need the index to know which of them were changed
 * @param {Function} onChangeFilter - function to change the filter instance data we change the hole filter instances
 * always, that's why the function must come from its parent. We change on the parent, so we can send the filter
 * data to the listing component
 * @param {Function} removeFilter - same as `onChangeFilter` we remove the filterInstance on the parent component.
 * @param {Object} filter - A object containing all of the data regarding the filter instance, so the Field we want
 * to filter on, and the value to filter.
 */
const ListingFilterInstance = (props) => {
    const [searchField, setSearchField] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [searchFieldTitle, setSearchFieldTitle] = useState('Filtrar por...')
   
    const onSelectField = (field) => {
        const fieldName = field.name
        setSearchField(fieldName)
        setSearchFieldTitle(
            props.headers.filter(field => field.name === fieldName).length > 0 ? 
            props.headers.filter(field => field.name === fieldName)[0].label_name : strings['pt-br']['listingFilterFieldsDropdownButttonLabel']
        )
        props.onChangeFilter(props.index, fieldName, searchValue)
    }
    
    const onChangeFilterValue = (value) => {
        setSearchValue(value)
        props.onChangeFilter(props.index, searchField, value)
    }

    useEffect(() => {
        if (props.filter.field_name !== searchField){
            setSearchField(props.filter.field_name)
            setSearchFieldTitle(
                props.headers.filter(field => field.name === props.filter.field_name).length > 0 ? 
                props.headers.filter(field => field.name === props.filter.field_name)[0].label_name : strings['pt-br']['listingFilterFieldsDropdownButttonLabel']
            )
        }
    }, [props.filter.field_name])
    
    useEffect(() => {
        if (props.filter.value !== searchValue){
            setSearchValue(props.filter.value)
        }
    }, [props.filter.value])

    return (
        <ListingFilterInputGroup>
            <Dropdown>
                <Dropdown.Toggle as={ListingFilterInputDropdownButton}>
                    {searchFieldTitle}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {props.headers.map((field, index) => (
                        <Dropdown.Item as="button" key={index} onClick={e => (onSelectField(field))}>
                            {field.label_name}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            <ListingFilterInput placeholder={strings['pt-br']['listingFilterInputPlaceholder']} value={searchValue} onChange={e => onChangeFilterValue(e.target.value)}/>
            {props.index !== 0 || searchValue !== '' || searchField !== '' ? (
                <ListingFilterDeleteButton onClick={e=> {props.removeFilter(props.index)}}>
                    <FontAwesomeIcon icon="trash"/>
                </ListingFilterDeleteButton>
            ) : ''}
        </ListingFilterInputGroup>

    )
}

export default ListingFilterInstance;