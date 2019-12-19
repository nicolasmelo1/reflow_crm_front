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




const GestaoTab = (props) => {
    const id = props.id;
    return (
        <div className="gestao-tab">
            <Tab.Container id="gestao-tabs" defaultActiveKey="kanban">
                <Row>
                    <Col sm={{ span: 3, offset: 9 }}>
                        <Nav className="mr-auto gestao-tab" style={{ fontSize: "30px", padding: '0px' }}>
                            <Nav.Item>
                                <Link href="/gestao/kanban/[id]" as={`/gestao/kanban/${id}`} passHref><Nav.Link eventKey="kanban" style={{ textDecoration: 'none', color: '#0dbf7e', fontWeight: '700' }}><a>Kanban</a></Nav.Link></Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link href="/gestao/listagem/[id]" as={`/gestao/listagem/${id}`} passHref><Nav.Link eventKey="listagem" className="ls_l" style={{ textDecoration: 'none', color: '#0dbf7e', fontWeight: '400' }}><a>Listagem</a></Nav.Link></Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Row>
            </Tab.Container>
        </div>

    )
}
export default GestaoTab;