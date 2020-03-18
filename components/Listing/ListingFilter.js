import React, { useState, useEffect } from 'react';
import { ListingFilterButton, ListingFilterIcon, ListingFilterBottomButton, ListingFilterSearchButton, ListingFilterContainer } from 'styles/Listing';
import ListingFilterInstance from './ListingFilterInstance'
import { strings } from 'utils/constants'


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
        searchInstances.splice(index, 1)
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
        <div style={{position:'relative', display: 'inline-block'}} ref={dropdownRef}>
            <ListingFilterButton onClick={e => {onToggleFilter(e)}}>
                <ListingFilterIcon icon="filter"/>&nbsp;{strings['pt-br']['listingFilterButtonLabel']}
            </ListingFilterButton>
            {isOpen ? (
                <ListingFilterContainer>
                    {searchInstances.map((filter, index) => (
                        <ListingFilterInstance
                        key={index}
                        index={index}
                        filter={filter}
                        onChangeFilter={onChangeFilter}
                        removeFilter={removeFilter}
                        headers={headers}
                        />
                    ))}
                    <ListingFilterSearchButton onClick={e => {sendFilterData(e)}}>{strings['pt-br']['listingFilterSearchButtonLabel']}</ListingFilterSearchButton>
                    <ListingFilterBottomButton onClick={e => {addNewFilter(e)}}>{strings['pt-br']['listingFilterAddNewFilterButtonLabel']}</ListingFilterBottomButton>
                </ListingFilterContainer>
            ) : ''}
        </div>
    )
}

export default ListingFilter;