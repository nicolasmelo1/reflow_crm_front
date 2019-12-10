import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import KanbanCard from './KanbanCard'
import CardColumns from 'react-bootstrap/CardColumns'
import ListGroup from 'react-bootstrap/ListGroup'


const KanbanList = (props) => {
    return (
        //<Col lg={{span:2, offset: 2}}>
        <div>
            <h1>{props.name}</h1>
            <div style={{overflowY:"scroll", overflowX:"hidden", maxHeight:"600px"}}>
                <KanbanCard />
                <KanbanCard />
                <KanbanCard />
                <KanbanCard />
                <KanbanCard />
            </div>
        </div>
        //</Col>
    )
}

export default KanbanList;