import React from 'react'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import Table from 'react-bootstrap/Table'


const iconStyle = {
    float: "left"
}

const ListagemCard = () => {
    return (
        <Card style={{ width: '220px', height:'', border: "0", fontSize: "12px", margin: "0", padding: "0", marginLeft: "6px", }}>
            <Card.Body>
                <Card.Title>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Status</span>
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