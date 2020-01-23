import React from 'react'
import Table from 'react-bootstrap/Table'
import ListagemTableHead from './ListagemTableHead'

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
    console.log(props.elements)
    return (
        <Table bordered hover style={{ textAlign: "center", overflowY: "scroll", maxHeight: "600px" }}>
            <ListagemTableHead things={props.elements} />
        </Table>
    )
}

export default ListagemTable;