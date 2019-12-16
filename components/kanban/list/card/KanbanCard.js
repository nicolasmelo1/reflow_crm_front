import React from 'react'
import Card from 'react-bootstrap/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Row } from 'react-bootstrap'

const iconStyle = {
    float: "left"
}



const KanbanCard = React.forwardRef((props, _) => {
    props = { ...props }
    return (
        <Card style={{ width: '365px', marginBottom: "10px", borderRadius: "10px", boxShadow: "0 3px 6px rgba(0,0,0,0.3" }}>
            <Card.Body style={{ padding: '10px', paddingLeft: '24px' }}>

                <FontAwesomeIcon style={{ width: "20px", color: "#444444", position: "absolute", right: "22px", top: "16px" }} icon="arrows-alt" />
                <FontAwesomeIcon style={{ width: "23px", color: "#0dbf7e", position: "absolute", right: "24px", bottom: "12px" }} icon="edit" />
                <FontAwesomeIcon style={{ width: "23px", color: "#0dbf7e", position: "absolute", right: "57px", bottom: "12px" }} icon="cloud-upload-alt" />

                <Card.Title >
                    <span style={{ color: "#444444", fontSize: "24px", fontWeight: 400, fontFamily: "Segoe UI" }}>{props.title}</span>
                </Card.Title>

                <Card.Subtitle>
                    <span style={{ color: "#707070", fontSize: "20px", fontWeight: 400, fontFamily: "Segoe UI" }}>{props.subtitle}</span>
                </Card.Subtitle>

                <Card.Text>
                    <span style={{ color: "#707070", fontSize: "20px", fontWeight: 400, fontFamily: "Segoe UI" }}>{props.value}</span>
                </Card.Text>

                <footer>
                    <span style={{ color: "#707070", fontSize: "20px", fontWeight: 400, fontFamily: "Segoe UI" }}>{props.footer}</span>
                </footer>
            </Card.Body>
        </Card>
    )
});

export default KanbanCard;