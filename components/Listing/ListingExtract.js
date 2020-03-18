import React, { useState, useEffect } from 'react';
import { ListingFilterButton, ListingFilterContainer } from 'styles/Listing'
import DateRangePicker from 'components/Utils/DateRangePicker'
import { strings } from 'utils/constants'


const ListingExtract = (props) => {
    const [value, setValue] = useState('')
    const [updateDates, setUpdateDates] = useState({
        startDate: '',
        endDate: ''
    })
    const [isOpen, _setIsOpen] = useState(false)

    const dropdownRef = React.useRef()
    const inputRef = React.useRef()
    // Check Components/Utils/Select for reference and explanation
    const setIsOpenRef = React.useRef(isOpen);
    const setIsOpen = data => {
        setIsOpenRef.current = data;
        _setIsOpen(data);
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

    return (
        <div style={{position:'relative', display: 'inline-block'}} ref={dropdownRef}>
            <ListingFilterButton onClick={e => {onToggleExtract(e)}}>
                Extrair
            </ListingFilterButton>
            {isOpen ? ( 
                <ListingFilterContainer>
                    <div>
                        <h2>Data de atualização</h2>
                        <input ref={inputRef} type="text" value={value}/>
                        <DateRangePicker input={inputRef}/>
                        <button>
                            .csv
                        </button>
                        <button>
                            .xlsx
                        </button>
                    </div>
                </ListingFilterContainer>
            ) : ''}
        </div>
    )
}

export default ListingExtract;