import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import KanbanList from './KanbanList'

const KanbanMain = () => {
    return (
        <Row>
            <Col sm={{ span: 2}}>
                <KanbanList name="Prospecção" />
            </Col>
            <Col sm={{ span: 2 }}>
                <KanbanList name="Negociação" />
            </Col>
            <Col sm={{ span: 2 }}>
                <KanbanList name="Fechado" />
            </Col>
            <Col sm={{ span: 2 }}>
                <KanbanList name="Perdido" />
            </Col>
            <Col sm={{ span: 2 }}>
                <KanbanList name="Aaaaaaaaaa" />
            </Col>
        </Row>
    )
}

export default KanbanMain;