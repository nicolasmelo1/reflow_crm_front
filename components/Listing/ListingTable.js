import React from 'react'
import ListingTableContent from './ListingTableContent'
import ListingTableHeader from './ListingTableHeader'
import { ListingTableContainer } from 'styles/Listing'
import { Table } from 'react-bootstrap'

/**
 * This component holds most of the logic from the table component, with it`s headers and content.
 * 
 * @param {Function} onSort - the function to sort the data, this function changes the `params`object
 * this function also updates the `data` array, since it makes a call to the backend to retrieve the sorted data.
 * @param {Function} setFormularyId - This function is actually retrieved from the page, this function retrieved 
 * from the Data page sets a FormularyId when the user clicks the pencil button to edit and open the formulary.
 * @param {Object} params - the parameters of the listing, parameters define the filter, the sort, the date range
 * and many other stuff. With this we can know the sorted field.
 * @param {Object} headers - object containing primarly all of the fields in the header.
 * @param {Array<Object>} data - The data to display on the table.
 */
const ListingTable = (props) => {
    const headers = (props.headers && props.headers.field_headers) ? props.headers.field_headers: []
    const data = (props.data) ? props.data: []

    return (
        <ListingTableContainer>
            <Table>
                <ListingTableHeader headers={headers} params={props.params} onSort={props.onSort}/>
                <ListingTableContent headers={headers} data={data} setFormularyId={props.setFormularyId} />
            </Table>
        </ListingTableContainer>
    )
}

export default ListingTable;