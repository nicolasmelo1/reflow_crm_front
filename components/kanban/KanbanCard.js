import React from 'react'
import Card from 'react-bootstrap/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const iconStyle = {
    float: "left"
}

const KanbanCard = () => {
    return (
        <Card style={{width: '265px', marginBottom:"6px",}}>
            <Card.Body>
                <Card.Title>
                    <div style={{ display:"flex", justifyContent:"space-between"}}>
                        <span>Cliente 01</span>
                        <FontAwesomeIcon className="card-icon-move" icon="arrows-alt" />
                    </div>                
                </Card.Title>
                <Card.Subtitle>Comercial 2</Card.Subtitle>
                <Card.Text>20.000</Card.Text>
                <footer className="blockquote-footer">
                    Alta
                </footer>
            </Card.Body>
        </Card>
    )
}
export default KanbanCard;