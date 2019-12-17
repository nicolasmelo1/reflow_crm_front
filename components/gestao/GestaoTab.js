import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav'
import NavBar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Link from 'next/link';
import TabContainer from 'react-bootstrap/TabContainer'
import Tab from 'react-bootstrap/Tab'
import KanbanPane from '../kanban/KanbanPane'
import ListagemPane from '../listagem/ListagemPane'



const GestaoTab = (props) => {
    const id = props.id;
    return (
        <div className="gestao-tab">
            <Tab.Container id="gestao-tabs" defaultActiveKey="kanban">
                <Row>
                    <Col sm={{ span: 2, offset: 10 }}>
                        <Nav className="mr-auto gestao-tab" style={{fontSize:"30px", padding:'0px'}}>
                            <Nav.Item>
                                <Nav.Link eventKey="kanban" style={{ textDecoration: 'none', color: '#0dbf7e', fontWeight:'700' }}>Kanban</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="listagem" className="ls_l" style={{ textDecoration: 'none', color: '#0dbf7e', fontWeight:'400' }}>Listagem</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Row>
                <Row>
                <Col sm={{offset: 1}}>
                    <Tab.Content>
                            <Tab.Pane eventKey="kanban">
                                <KanbanPane id={id}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="listagem">
                                <ListagemPane id={id}/>
                            </Tab.Pane>
                    </Tab.Content>
                </Col>
                </Row>
            </Tab.Container>
        </div>

    )
}
export default GestaoTab;