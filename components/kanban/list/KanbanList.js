import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import KanbanCard from './card/KanbanCard'
import CardColumns from 'react-bootstrap/CardColumns'
import ListGroup from 'react-bootstrap/ListGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const KanbanList = (props) => {
    return (
        //<Col lg={{span:2, offset: 2}}>
        <div>
            <div className="kanban-list-header">
                <Row>
                    <Col sm={{ span: 9 }}>
                        <h1 style={{ fontSize: "30px", fontWeight: "700", color: "#444444" }}>{props.name}</h1>
                    </Col>
                    <Col>
                        <FontAwesomeIcon style={{ width: "2em", color: "#707070" }} icon="bars" size="xs" />
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ span: 7, offset: 0 }}>
                        <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#707070", marginLeft: "15px" }}>{props.subtitle}</h2>
                    </Col>
                    <Col sm={{}}>
                        <FontAwesomeIcon style={{ width: "1.5em", color: "#bfbfbf" }} icon="pen" />
                    </Col>
                </Row>
            </div>
            <div className="kanban-card-list" style={{ overflowY: "auto", overflowX: "hidden", maxHeight: "600px", marginTop: "10px" }}>
                <KanbanCard title="cliente" subtitle="teste" value="teste" footer="alta" />
                <KanbanCard title="cliente" subtitle="teste" value="teste" />
                <KanbanCard title="cliente" subtitle="teste" value="teste" />
                <KanbanCard title="cliente" subtitle="teste" value="teste" />
                <KanbanCard title="cliente" subtitle="teste" value="teste" />
                <KanbanCard title="cliente" subtitle="teste" value="teste" />
                <KanbanCard title="cliente" subtitle="teste" value="teste" />
                <KanbanCard title="cliente" subtitle="teste" value="teste" />
                <KanbanCard title="cliente" subtitle="teste" value="teste" />
                <KanbanCard title="cliente" subtitle="teste" value="teste" />
            </div>
        </div>
        //</Col>
    )
}

export default KanbanList;