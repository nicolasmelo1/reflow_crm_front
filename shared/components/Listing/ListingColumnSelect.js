import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { strings } from '../../utils/constants'
import { ListingColumnSelectButton, ListingColumnSelectItemsContainer, ListingColumnSelectItems, ListingColumnSelectContainer } from '../../styles/Listing'

/**
 * This component contains the user selected columns button login, the button can be found
 * on the top right of the table in the Listing page.
 * This component renders the button and the options it display, it also contains the logic when the user
 * selects or unselect a column.
 * 
 * @param {Array} field_headers - list containing primarly all of the fields in the header. we use this array
 * to construct all of the field options he can select or unselect to show or don't show on the table.
 * @param {Function} onUpdateHeader - function to update Header data in the redux, this function does not fire
 * any request to the backend, it just updates the header state in the redux.
 * @param {Function} onUpdateSelected - function to make a request to the backend to save its state, this doesn't update
 * the state on the redux store. 
 */
const ListingColumnSelect = (props) => {

    const onToggleSelect = (e, index) => {
        e.preventDefault()
        props.field_headers[index].is_selected = !props.field_headers[index].is_selected
        props.onUpdateHeader(props.field_headers)
        props.onUpdateSelected(props.field_headers, props.formName)
    }

    return (
        <ListingColumnSelectContainer>
            <Dropdown.Toggle as={ListingColumnSelectButton}>
                {strings['pt-br']['listingColumnSelectButtonLabel']}
            </Dropdown.Toggle>

            <ListingColumnSelectItemsContainer>
                {props.field_headers.map(function (data, index) {
                    return (
                        <ListingColumnSelectItems
                            as="button"
                            eventKey={index}
                            onClick={e => onToggleSelect(e, index)}
                            active={data.is_selected}
                            key={index}
                        >
                            {data.field.label_name}
                        </ListingColumnSelectItems>
                    )
                })}
            </ListingColumnSelectItemsContainer>
        </ListingColumnSelectContainer>
    )
}

export default ListingColumnSelect;