import React, { useState, useEffect } from 'react';
import { ListingFilterAndExtractContainer, ListingFilterAndExtractButton, ListingFilterIcon, ListingFilterAddNewFilterButton, ListingFilterSearchButton, ListingFilterContainer } from 'styles/Listing';
import ListingFilterInstance from './ListingFilterInstance'
import { strings } from 'utils/constants'

/**
 * This component controls all of the filters, when filtering the user can add or remove how many filters he wants
 * because most of the time he is filtering on two or more different columns.
 * 
 * So this function holds all of the filters logic, the button, and the container with the buttons to make the search
 * and to add more filters.
 * 
 * @param {Object} headers - object containing primarly all of the fields in the header. we use this array
 * to construct all of the field options he can select or unselect to filter.
 * @param {Object} params - the parameters of the listing, parameters define the filter, the sort, the date range
 * and many other stuff. With this we can create the filters based on the params.
 * @param {Function} onFilter - function responsible for effectively adding all of the filters to the params object 
 * and for calling the function to get the new filtered data.
 */
const ListingFilter = (props) => {
    const [isOpen, _setIsOpen] = useState(false)
    const [searchInstances, setSearchInstances] = useState([]);
    const dropdownRef = React.useRef()
    const headers = (props.headers && props.headers.field_headers) ? props.headers.field_headers: []

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

    return (
        <ListingFilterAndExtractContainer ref={dropdownRef}>
            <ListingFilterAndExtractButton onClick={e => {onToggleFilter(e)}}>
                <ListingFilterIcon icon="filter"/>&nbsp;{strings['pt-br']['listingFilterButtonLabel']}
            </ListingFilterAndExtractButton>
            {isOpen ? (
                <ListingFilterContainer>
                    {searchInstances.map((filter, index) => (
                        <ListingFilterInstance
                        key={index}
                        index={index}
                        filter={filter}
                        onChangeFilter={onChangeFilter}
                        removeFilter={removeFilter}
                        types={props.types}
                        headers={headers}
                        />
                    ))}
                    <ListingFilterSearchButton onClick={e => {sendFilterData(e)}}>{strings['pt-br']['listingFilterSearchButtonLabel']}</ListingFilterSearchButton>
                    <ListingFilterAddNewFilterButton onClick={e => {addNewFilter(e)}}>{strings['pt-br']['listingFilterAddNewFilterButtonLabel']}</ListingFilterAddNewFilterButton>
                </ListingFilterContainer>
            ) : ''}
        </ListingFilterAndExtractContainer>
    )
}

export default ListingFilter;