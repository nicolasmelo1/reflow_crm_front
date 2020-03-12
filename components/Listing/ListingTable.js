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
    return (
        <ListingTableContainer>
            <Table>
                <ListingTableHeader headers={props.headers}/>
                <ListingTableContent contents={props.elements} headers={props.headers} setFormularyId={props.setFormularyId} />
            </Table>
        </ListingTableContainer>
    )
}

export default ListingTable;