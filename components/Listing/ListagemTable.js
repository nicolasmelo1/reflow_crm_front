import React from 'react'

import ListagemTableHead from './ListagemTableHead'
import ListagemTableContent from './ListagemTableContent'
import { ListingTable } from 'styles/Listing'


const ListagemTable = (props) => {
    return (
        <ListingTable bordered hover size="sm">
            <ListagemTableHead headers={props.heading} />
            <ListagemTableContent contents={props.elements} headers={props.heading} />

        </ListingTable>
    )
}

export default ListagemTable;