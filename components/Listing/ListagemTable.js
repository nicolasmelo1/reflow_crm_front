import React from 'react'

import ListagemTableHead from './ListagemTableHead'
import ListagemTableContent from './ListagemTableContent'
import { ListingTable } from 'styles/Listing'


const ListagemTable = (props) => {





    /* let ret = planilha1['tabelas'][id]['tableheader'].map(function (namer) {
        return <TblPopover element={namer} id={id} />;
        });

    let line = planilha1['tabelas'][id]['table'].map(function (eachline) {
        let row = eachline.map(function(eachrow) {
            return <td>{eachrow}</td>
        });
        return <tr>{row}</tr>
    }); */
    return (
        <ListingTable bordered hover size="sm">
            <ListagemTableHead things={props.heading} />
            <ListagemTableContent contents={props.elements} headers={props.heading} />

        </ListingTable>
    )
}

export default ListagemTable;