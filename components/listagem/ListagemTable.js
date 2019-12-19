import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import planilha1 from '../texts/planilha-1'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TblPopover from './TblPopover'

const ListagemTable = (props) => {
    const id = props.id;

    let ret = planilha1['tabelas'][id]['tableheader'].map(function (namer) {
        return <TblPopover element={namer} id={id} />;
        });

    let line = planilha1['tabelas'][id]['table'].map(function (eachline) {
        let row = eachline.map(function(eachrow) {
            return <td>{eachrow}</td>
        });
        return <tr>{row}</tr>
    });
    
    return (
        <Table bordered hover style={{textAlign:"center", overflowY:"scroll", maxHeight:"600px"}}>
            <thead className="thead-dark">
                <tr>
                    {ret}
                </tr>
            </thead>
            <tbody>
                    {line}     
            </tbody>
        </Table>
    )
}

export default ListagemTable;