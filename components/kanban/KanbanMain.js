import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import KanbanList from './list/KanbanList'
import planilha1 from '../texts/planilha-1'


const KanbanMain = (props) => {
    console.log(props.id)
    let ret = planilha1['tabelas'][props.id]['content'].map(function (namer) {
        return <Col sm={{ span: 3 }}><KanbanList name={namer} /></Col>;
        });

    return <Row>{ret}</Row>
}

export default KanbanMain;

    