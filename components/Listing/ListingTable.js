import React from 'react'
import ListingTableContent from './ListingTableContent'
import ListingTableHeader from './ListingTableHeader'
import { ListingTableContainer } from 'styles/Listing'
import { Table } from 'react-bootstrap'

/**
 * The full table component, with it`s headers and content
 * @param {*} props 
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