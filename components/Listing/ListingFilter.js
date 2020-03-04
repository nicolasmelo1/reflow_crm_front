import React, { useState } from 'react';
import { ListingFilterButton, ListingFilterIcon } from 'styles/Listing';
import { Dropdown, InputGroup, FormControl, Button, DropdownButton } from 'react-bootstrap';
import ListingFilterInstance from './ListingFilterInstance'
const ListingFilter = (props) => {
    const [formInstanceNumber, setFormInstanceNumber] = useState([addNewValue()]);

    const heading = (props.headers && props.headers.field_headers) ? props.headers.field_headers: []

    function addNewValue() {
        return {
            value: "",
            field_name: "",
            label_name: ""
        }
    }

    function addNewFilter(e) {
        e.preventDefault()
        formInstanceNumber.push(addNewValue())
        setFormInstanceNumber([...formInstanceNumber])

    }

    function sendFilterData(e) {
        e.preventDefault()
        let urlParams = {
            from: '25/11/2019',
            to: '23/01/2020',
            page: 1,
            search_value: [],
            search_exact: [],
            search_field: []
        }

        formInstanceNumber.map(function (search, index) {
            urlParams.search_exact.push(0);
            urlParams.search_field.push(search.field_name);
            urlParams.search_value.push(search.value);
        })
        props.onGetData(urlParams, 'negocios')
    }

    return (
        <Dropdown>

            <Dropdown.Toggle as={ListingFilterButton} size="sm">
                <ListingFilterIcon icon="filter" />Filtro
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ width: "600px" }}>
                {formInstanceNumber.map(function (form, index) {
                    return <ListingFilterInstance
                        heading={heading}
                        ind={index}
                        key={index}
                        parameter={form}
                        filterState={formInstanceNumber}
                        setFormInstanceNumber={setFormInstanceNumber} />
                })}


                <Button onClick={e => (sendFilterData(e))}>Pesquisar</Button>
                <Button onClick={e => (addNewFilter(e))}>Adicionar outro filtro</Button>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ListingFilter;