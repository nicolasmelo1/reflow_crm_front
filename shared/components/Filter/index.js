import React, { useState, useEffect } from 'react';
import FilterInstance from './FilterInstance'
import { FilterAddNewFilterButton, FilterSearchButton } from '../../styles/Filter';
import { strings } from '../../utils/constants'

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
    console.log(props.fields)

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
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen)
    }

    const sendFilterData = (e) => {
        e.preventDefault()
        props.onFilter(searchInstances)
        setIsOpen(false)
    }

    const onToggleFilterOnClickOutside = (e) => {
        e.stopPropagation();
        if (dropdownRef.current && !dropdownRef.current.contains(e.target) && setIsOpenRef.current) {
            setIsOpen(false)
        }
    }

    const pluralOrSingularButtonLabel = (instancesLength) => {
        if (instancesLength === 1) {
            return '1 filtro ativo'
        } else {
            return instancesLength.toString() + ' filtros ativos'
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
        document.addEventListener("mousedown", onToggleFilterOnClickOutside); 
        return () => {
            document.removeEventListener("mousedown", onToggleFilterOnClickOutside);
        };
    }, [onToggleFilterOnClickOutside])

    const ContainerComponent = props.container ? props.container : `div`
    const FilterContainerComponent = props.filterContainer ? props.filterContainer: `div`
    const FilterButton = props.filterButton ? props.filterButton : `button`
    const fiterButtonLabel = props.params.search_value.length === 0 ? strings['pt-br']['filterButtonLabel'] : pluralOrSingularButtonLabel(props.params.search_value.length)
    return (
        <ContainerComponent ref={dropdownRef}>
            <FilterButton onClick={e => {onToggleFilter(e)}}>
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
                    <FilterSearchButton onClick={e => {sendFilterData(e)}}>{strings['pt-br']['filterSearchButtonLabel']}</FilterSearchButton>
                    <FilterAddNewFilterButton onClick={e => {addNewFilter(e)}}>{strings['pt-br']['filterAddNewFilterButtonLabel']}</FilterAddNewFilterButton>
                </FilterContainerComponent>
            ) : ''}
        </ContainerComponent>
    )
}

export default Filter;