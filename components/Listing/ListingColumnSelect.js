import React from 'react'
import { ListingColumnSelectButton, ListingColumnSelectItemsContainer, ListingColumnSelectItems, ListingColumnSelectContainer } from 'styles/Listing'
import { Dropdown } from 'react-bootstrap'
import { strings } from 'utils/constants'


const ListingColumnSelect = (props) => {
    const headers = (props.headers && props.headers.field_headers) ? props.headers.field_headers: []

    const onToggleSelect = (e, index) => {
        e.preventDefault()
        props.headers.field_headers[index].user_selected = !props.headers.field_headers[index].user_selected
        const body = {
            fields: props.headers.field_headers.filter(head => head.user_selected).map(head => {
                return head.name
            })
        }
        props.onUpdateHeader(props.headers)
        props.onUpdateSelected(body, props.formName)
    }

    return (
        <ListingColumnSelectContainer>
            <Dropdown.Toggle as={ListingColumnSelectButton}>
                {strings['pt-br']['listingColumnSelectButtonLabel']}
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