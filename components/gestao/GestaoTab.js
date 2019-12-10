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


const GestaoTab = () => {
    return (
        <div className="gestao-tab">
            <Tab.Container id="gestao-tabs" defaultActiveKey="listagem">
                <Row>
                    <Col sm={{ span: 2, offset: 10 }}>
                        <Nav className="mr-auto">
                            <Nav.Item>
                                <Nav.Link eventKey="kanban">Kanban</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="listagem">Listagem</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Row>
                <Row>
                <Col sm={{offset: 2}}>
                    <Tab.Content>
                            <Tab.Pane eventKey="kanban">
                                <KanbanPane />
                            </Tab.Pane>
                            <Tab.Pane eventKey="listagem">
                                <ListagemPane />
                            </Tab.Pane>
                    </Tab.Content>
                </Col>
                </Row>
            </Tab.Container>
        </div>

    )
}
export default GestaoTab;