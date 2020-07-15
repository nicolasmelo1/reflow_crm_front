import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Modal, Text, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native'
import FilterInstance from './FilterInstance'
import { 
    FilterAddNewFilterButton, 
    FilterHeaderContainer,
    FilterSearchButton, 
    FilterSpinner 
} from '../../styles/Filter';
import { strings } from '../../utils/constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

/**
 * This component controls all of the filters, when filtering the user can add or remove how many filters he wants
 * because most of the time he is filtering on two or more different columns.
 * 
 * So this function holds all of the filters logic, the button, and the container with the buttons to make the search
 * and to add more filters.
 * 
 * @param {Array<Object>} fields - object containing primarly all of the fields the user can filter. we use this array
 * to construct all of the field options he can select or unselect to filter. 
 * The object on the filter must follow the structure: 
 * `{
 *      type: 'date',
 *      name: 'foo',
 *      label: 'bar'
 * }`
 * @param {Object} params - the parameters of the listing, parameters define the filter, the sort, the date range
 * and many other stuff. With this we can create the filters based on the params.
 * @param {Function} onFilter - function responsible for effectively adding all of the filters to the params object 
 * and for calling the function to get the new filtered data.
 * @param {Boolean} isLoading - When you press to search, the filter enters in a loading state so the user cannot load
 * again until it is not in loading state anymore
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff
 * @param {React.Component} container - (optional) - defaults to a simple div, this is the holder of the button and the dropdown
 * element.
 * @param {React.Component} filterButton - (optional) - defaults to a simple button, if you want to style the Button, you can
 * style within this component
 * @param {React.Component} filterContainer - (optional) - defaults to a simple div, this container is for the contents of the filter
 * sometimes you want to display it on the right, insstead on the left of the button.
 * @param {React.JSX} filterButtonIcon - (optional) - The icon to display on the left side of the button label.
 */
const Filter = (props) => {
    const [isOpen, _setIsOpen] = useState(false)
    const [searchInstances, setSearchInstances] = useState([]);
    const dropdownRef = React.useRef()
    const fields = (props.fields) ? props.fields: []

    // Check Components/Utils/Select for reference and explanation
    const setIsOpenRef = React.useRef(isOpen);
    const setIsOpen = data => {
        setIsOpenRef.current = data;
        _setIsOpen(data);
    }

    function newEmptyFilter() {
        return {
            value: "",
            field_name: ""
        }
    }

    const removeFilter = (index) => {
        if (index === 0) {
            searchInstances.splice(index, 1, newEmptyFilter())
            if (searchInstances.length === 1) {
                onToggleFilter()
                props.onFilter(searchInstances)
            }
        } else {
            searchInstances.splice(index, 1)
        }
        setSearchInstances([...searchInstances])
    }

    const onChangeFilter = (index, field, value) => {
        searchInstances[index].field_name = field
        searchInstances[index].value = value
        setSearchInstances([...searchInstances])
    }

    const addNewFilter = (e) => {
        e.preventDefault()
        searchInstances.push(newEmptyFilter())
        setSearchInstances([...searchInstances])
    }

    const onToggleFilter = (e) => {
        setIsOpen(!isOpen)
    }

    const sendFilterData = (e) => {
        e.preventDefault()
        props.onFilter(searchInstances)
    }

    const onToggleFilterOnClickOutside = (e) => {
        e.stopPropagation();
        if (dropdownRef.current && !dropdownRef.current.contains(e.target) && setIsOpenRef.current) {
            setIsOpen(false)
        }
    }

    const pluralOrSingularButtonLabel = (instancesLength) => {
        if (instancesLength === 1) {
            return strings['pt-br']['filterButtonLabelOneFilter']
        } else {
            return strings['pt-br']['filterButtonLabelNFilters'].replace('{}', instancesLength.toString())
        }
    }

    useEffect(() => {
        const search = []
        for (let i=0; i<props.params.search_value.length; i++) {
            search.push({
                value: props.params.search_value[i],
                field_name: props.params.search_field[i],
            })
        }
        if (search.length === 0) {
            search.push(newEmptyFilter())
        }
        setSearchInstances(search)
    }, [props.params])

    useEffect(() => {
        if (!props.isLoading && isOpen) {
            setIsOpen(false)
        }
    }, [props.isLoading])

    useEffect(() => {
        if (process.env['APP'] === 'web') {
            document.addEventListener("mousedown", onToggleFilterOnClickOutside)
        }
        return () => {
            if (process.env['APP'] === 'web') {
                document.removeEventListener("mousedown", onToggleFilterOnClickOutside)
            }
        }
    }, [onToggleFilterOnClickOutside])

    const ContainerComponent = props.container ? props.container : process.env['APP'] === 'web' ? `div` : View
    const FilterContainerComponent = props.filterContainer ? props.filterContainer: process.env['APP'] === 'web' ? `div` : Modal
    const FilterButton = props.filterButton ? props.filterButton : process.env['APP'] === 'web' ? `button` : TouchableOpacity
    const FilterButtonLabel = props.filterButtonLabel ? props.filterButtonLabel : process.env['APP'] === 'web' ? `p` : Text
    const fiterButtonLabel = props.params.search_value.length === 0 ? strings['pt-br']['filterButtonLabel'] : pluralOrSingularButtonLabel(props.params.search_value.length)

    const renderMobile = () => {
        return (
            <View>
                <FilterButton onPress={e => onToggleFilter()}>
                    {props.filterButtonIcon}<FilterButtonLabel>&nbsp;{fiterButtonLabel}</FilterButtonLabel>
                </FilterButton>
                {isOpen ? (
                    <FilterContainerComponent animationType={'slide'}>
                        <SafeAreaView style={{ height: '100%' }}>
                            <KeyboardAvoidingView
                            style={{ flex: 1, flexDirection: 'column',justifyContent: 'center'}} 
                            behavior="padding" 
                            enabled  
                            >
                                <FilterHeaderContainer>
                                    <TouchableOpacity 
                                    style={{padding: 10}}
                                    onPress={e=>onToggleFilter()}>
                                        <FontAwesomeIcon icon={'times'}/>
                                    </TouchableOpacity>
                                </FilterHeaderContainer>
                                <FilterAddNewFilterButton onPress={e => {addNewFilter(e)}}>
                                    <Text>
                                        {strings['pt-br']['filterAddNewFilterButtonLabel']}
                                    </Text>
                                </FilterAddNewFilterButton>
                                <ScrollView
                                style={{ height: '100%'}}
                                keyboardShouldPersistTaps={'handled'}
                                >
                                    {searchInstances.map((filter, index) => (
                                        <FilterInstance
                                        key={index}
                                        index={index}
                                        filter={filter}
                                        onChangeFilter={onChangeFilter}
                                        removeFilter={removeFilter}
                                        types={props.types}
                                        fields={fields}
                                        />
                                    ))}
                                </ScrollView>
                                <FilterSearchButton onPress={e => {
                                    sendFilterData(e)
                                    setIsOpen(false)
                                }}>
                                    <Text>
                                        {strings['pt-br']['filterSearchButtonLabel']}
                                    </Text>
                                </FilterSearchButton>
                            </KeyboardAvoidingView>
                        </SafeAreaView>
                    </FilterContainerComponent>
                ) : null}
            </View>
        )
    }

    const renderWeb = () => {
        return (
            <ContainerComponent ref={dropdownRef}>
                <FilterButton onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    onToggleFilter()
                }}>
                    {props.filterButtonIcon ? (
                        <span>
                            {props.filterButtonIcon}&nbsp;{fiterButtonLabel}
                        </span>
                    ) : (
                        <span>
                            {fiterButtonLabel}
                        </span>)
                    }
                </FilterButton>
                {isOpen ? (
                    <FilterContainerComponent>
                        {searchInstances.map((filter, index) => (
                            <FilterInstance
                            key={index}
                            index={index}
                            filter={filter}
                            onChangeFilter={onChangeFilter}
                            removeFilter={removeFilter}
                            types={props.types}
                            fields={fields}
                            />
                        ))}
                        <FilterSearchButton onClick={e => {props.isLoading ? null : sendFilterData(e)}}>
                            {props.isLoading ? (<FilterSpinner animation="border" size="sm"/>) : (strings['pt-br']['filterSearchButtonLabel'])}
                        </FilterSearchButton>
                        <FilterAddNewFilterButton onClick={e => {addNewFilter(e)}}>{strings['pt-br']['filterAddNewFilterButtonLabel']}</FilterAddNewFilterButton>
                    </FilterContainerComponent>
                ) : ''}
            </ContainerComponent>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()

}

export default Filter;