import React, { useState, useEffect } from 'react'
import { FilterInputGroup, FilterInputDropdownButton, FilterInput, FilterDeleteButton } from 'styles/Filter'
import DateRangePicker from 'components/Utils/DateRangePicker'
import { stringToJsDateFormat, jsDateToStringFormat } from 'utils/dates'
import { strings } from 'utils/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown } from 'react-bootstrap'

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
const FilterInstance = (props) => {
    const dateFormat = 'DD/MM/YYYY'

    const [searchFieldType, setSearchFieldType] = useState(null)
    const [searchField, setSearchField] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [searchFieldTitle, setSearchFieldTitle] = useState(strings['pt-br']['filterFieldsDropdownButttonLabel'])

    const inputRef = React.useRef()

    const onChangeFieldName = (fieldName) => {
        const currentField = props.fields.filter(field => field.name === fieldName).length > 0 ? props.fields.filter(field => field.name === fieldName)[0] : null
        console.log(props.fields)
        const currentFieldType = currentField && props.types.data.field_type.filter(fieldType => fieldType.id === currentField.type).length > 0 ? props.types.data.field_type.filter(fieldType => fieldType.id === currentField.type)[0].type : null
        console.log(currentFieldType)
        setSearchField(fieldName)
        setSearchFieldTitle(currentField ? currentField.label : strings['pt-br']['filterFieldsDropdownButttonLabel'])
        if (searchFieldType !== 'date' && currentFieldType === 'date') {
            setSearchValue('')
        }
        setSearchFieldType(currentFieldType)
    }

    const onSelectField = (field) => {
        const fieldName = field.name
        onChangeFieldName(fieldName)
    }
    
    const onChangeFilterValue = (value) => {
        if (searchFieldType === 'date') {
            value = `${jsDateToStringFormat(value[0], dateFormat)} - ${jsDateToStringFormat(value[1], dateFormat)}`
        }

        setSearchValue(value)
        props.onChangeFilter(props.index, searchField, value)
    }

    useEffect(() => {
        if (props.filter.field_name !== searchField){
            onChangeFieldName(props.filter.field_name)
        }
    }, [props.filter.field_name])

    useEffect(() => {
        if (props.filter.value !== searchValue){
            setSearchValue(props.filter.value)
        }
    }, [props.filter.value])

    return (
        <FilterInputGroup>
            {props.index !== 0 || searchValue !== '' || searchField !== '' ? (
                <FilterDeleteButton onClick={e=> {props.removeFilter(props.index)}}>
                    <FontAwesomeIcon icon="trash"/>
                </FilterDeleteButton>
            ) : ''}
            <Dropdown>
                <Dropdown.Toggle as={FilterInputDropdownButton}>
                    {searchFieldTitle}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {props.fields.map((field, index) => (
                        <Dropdown.Item as="button" key={index} onClick={e => (onSelectField(field))}>
                            {field.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            <FilterInput ref={inputRef} placeholder={strings['pt-br']['filterInputPlaceholder']} value={searchValue} onChange={e => onChangeFilterValue(e.target.value)}/>
            {searchFieldType === 'date' ? (
                <DateRangePicker input={inputRef} 
                closeWhenSelected={true}
                onChange={onChangeFilterValue} 
                initialDays={![null, undefined, ''].includes(searchValue) ? [stringToJsDateFormat(searchValue.split(' - ')[0], dateFormat), stringToJsDateFormat(searchValue.split(' - ')[1], dateFormat)] : ['', '']}
                />
            ) : ''}
        </FilterInputGroup>
    )
}

export default FilterInstance;