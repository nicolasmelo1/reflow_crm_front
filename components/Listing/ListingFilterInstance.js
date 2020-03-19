import React, { useState, useEffect } from 'react'
import { ListingFilterInputGroup, ListingFilterInputDropdownButton, ListingFilterInput, ListingFilterDeleteButton } from 'styles/Listing'
import { Dropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { strings } from 'utils/constants'

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