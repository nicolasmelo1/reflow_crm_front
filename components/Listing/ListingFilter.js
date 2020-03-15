import React, { useState } from 'react';
import { ListingFilterButton, ListingFilterIcon } from 'styles/Listing';
import { Dropdown, Button, DropdownButton } from 'react-bootstrap';
import ListingFilterInstance from './ListingFilterInstance'

const ListingFilter = (props) => {
    const [dropdownShow, setDropdownShow] = useState(false)
    const [formInstanceNumber, setFormInstanceNumber] = useState([addNewValue()]);
    const headers = (props.headers && props.headers.field_headers) ? props.headers.field_headers: []

    function addNewValue() {
        return {
            value: "",
            field_name: "",
            label_name: ""
        }
    }

    const toggleDropdown = (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('teste')
        setDropdownShow(!dropdownShow)
    }

    function addNewFilter(e) {
        e.preventDefault()
        formInstanceNumber.push(addNewValue())
        setFormInstanceNumber([...formInstanceNumber])
    }

    
    function sendFilterData(e) {
        e.preventDefault()
        setDropdownShow(false)
    }

    return (
        <div style={{position:'relative'}}>
            <ListingFilterButton onClick={e => {toggleDropdown(e)}} onBlur={e => {toggleDropdown(e)}}>
                <ListingFilterIcon icon="filter"/>Filtrar
            </ListingFilterButton>
            {dropdownShow ? ( 
                <div style={{ position: 'absolute', width: '600px', zIndex: 1, backgroundColor: 'white'}}>
                    {formInstanceNumber.map((form, index) => (
                        <ListingFilterInstance
                        key={index}
                        headers={headers}
                        index={index}
                        parameter={form}
                        filterState={formInstanceNumber}
                        setFormInstanceNumber={setFormInstanceNumber} 
                        />
                    ))}


                    <Button onClick={e => { sendFilterData(e) }}>Pesquisar</Button>
                    <Button onClick={e => (addNewFilter(e))}>Adicionar outro filtro</Button>
                </div>
            ) : ''}
        </div>
    )
}

export default ListingFilter;