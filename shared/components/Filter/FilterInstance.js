import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Dropdown } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { FilterInputGroup, FilterInputDropdownButton, FilterInput, FilterDeleteButton, FilterDropdownMenu } from '../../styles/Filter'
import DateRangePicker from '../Utils/DateRangePicker'
import { Select } from '../Utils'
import { stringToJsDateFormat, jsDateToStringFormat } from '../../utils/dates'
import { strings } from '../../utils/constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

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
    const [searchFieldType, setSearchFieldType] = useState(null)
    const [searchField, setSearchField] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [searchFieldTitle, setSearchFieldTitle] = useState(strings['pt-br']['filterFieldsDropdownButttonLabel'])

    const dateFormat = useSelector(state => state.login.dateFormat)

    const inputRef = React.useRef()

    const onChangeFieldName = (fieldName) => {
        const currentField = props.fields.filter(field => field.name === fieldName).length > 0 ? props.fields.filter(field => field.name === fieldName)[0] : null
        const currentFieldType = currentField && props.types.data.field_type.filter(fieldType => fieldType.id === currentField.type).length > 0 ? props.types.data.field_type.filter(fieldType => fieldType.id === currentField.type)[0].type : null
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
        props.onChangeFilter(props.index, fieldName, searchValue)
    }
    
    const onChangeFilterValue = (value) => {
        if (searchFieldType === 'date') {
            value = `${jsDateToStringFormat(value[0], dateFormat.split(' ')[0])} - ${jsDateToStringFormat(value[1], dateFormat.split(' ')[0])}`
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

    const renderMobile = () => {
        return (
            <FilterInputGroup>
                <View style={{ flexDirection: 'row'}}>
                    <FilterDropdownMenu>
                        <Select
                        placeholder={searchFieldTitle}
                        options={props.fields.map(field => ({value: field.name, label: field.label}))}
                        initialValues={props.fields.map(field => ({value: field.name, label: field.label})).filter(field => field.value === searchField)}
                        onChange={(data) => {
                            const selectedField = props.fields.filter(field => field.name === data[0])
                            if (selectedField.length > 0) {
                                onSelectField(selectedField[0])
                            }
                        }}
                        />
                    </FilterDropdownMenu>
                    {props.index !== 0 || searchValue !== '' || searchField !== '' ? (
                        <FilterDeleteButton onPress={e=> {props.removeFilter(props.index)}}>
                            <FontAwesomeIcon style={{ color: '#fff'}} icon="trash"/>
                        </FilterDeleteButton>
                    ) : null}
                </View> 
                <FilterInput ref={inputRef} placeholder={strings['pt-br']['filterInputPlaceholder']} value={searchValue} onChange={e => onChangeFilterValue(e.nativeEvent.text)}/>
            </FilterInputGroup>
        )
    }

    const renderWeb = () => {
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
                    <FilterDropdownMenu>
                        {props.fields.map((field, index) => (
                            <Dropdown.Item as="button" key={index} onClick={e => onSelectField(field)}>
                                {field.label}
                            </Dropdown.Item>
                        ))}
                    </FilterDropdownMenu>
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
    
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FilterInstance