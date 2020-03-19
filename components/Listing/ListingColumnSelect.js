import React, { useState } from 'react';
import { ListingColumnSelectButton, ListingColumnSelectItemsContainer, ListingColumnSelectItems, ListingColumnSelectContainer } from 'styles/Listing';
import { Button, Dropdown, FormControl } from 'react-bootstrap';

const ListingColumnSelect = (props) => {
    const headers = (props.headers && props.headers.field_headers) ? props.headers.field_headers: []

    const onToggleSelect = (e, index) => {
        e.preventDefault()
        props.onUpdateSelected(index, props.formName)
    }

    return (
        <ListingColumnSelectContainer>
            <Dropdown.Toggle as={ListingColumnSelectButton}>
                Selecionar colunas exibidas
            </Dropdown.Toggle>

            <ListingColumnSelectItemsContainer>
                {headers.map(function (data, index) {
                    return (
                        <ListingColumnSelectItems
                            as="button"
                            eventKey={index}
                            onClick={e => onToggleSelect(e, index)}
                            active={data.user_selected}
                            key={index}
                        >
                            {data.label_name}
                        </ListingColumnSelectItems>
                    )
                })}
            </ListingColumnSelectItemsContainer>
        </ListingColumnSelectContainer>
    )
}

export default ListingColumnSelect;