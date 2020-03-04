import React from 'react'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import Table from 'react-bootstrap/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const ListagemCard = () => {
    return (
        <Card style={{ width: '220px', height:'', border: "0", fontSize: "12px", margin: "0",marginBottom:"10px", padding: "0", marginLeft: "6px", borderRadius: "10px", boxShadow: "0 3px 6px rgba(0,0,0,0.3"}}>
            <Card.Body>
                <Card.Title>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Status</span>
                        <FontAwesomeIcon icon="trash" style={{ width: "24px", color: "red" }} />
                    </div>
                </Card.Title>

                <Table>
                    <tbody>
                        <tr>
                            <td style={{ border: "0", fontSize: "12px", margin: "0", padding: "0" }}>Prospecção</td>
                            <td style={{ border: "0", fontSize: "12px", margin: "0", padding: "0" }}>5</td>
                        </tr>
                        <tr>
                            <td style={{ border: "0", fontSize: "12px", margin: "0", padding: "0" }}>Negociação</td>
                            <td style={{ border: "0", fontSize: "12px", margin: "0", padding: "0" }}>9</td>
                        </tr>
                        <tr>
                            <td style={{ border: "0", fontSize: "12px", margin: "0", padding: "0" }}>Fechado</td>
                            <td style={{ border: "0", fontSize: "12px", margin: "0", padding: "0" }}>16</td>
                        </tr>
                        <tr>
                            <td style={{ border: "0", fontSize: "12px", margin: "0", padding: "0" }}>Perdido</td>
                            <td style={{ border: "0", fontSize: "12px", margin: "0", padding: "0" }}>10</td>
                        </tr>
                    </tbody>
                </Table>                    
            </Card.Body>
        </Card>
            )
        }
export default ListagemCard;