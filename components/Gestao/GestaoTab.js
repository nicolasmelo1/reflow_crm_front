import React from 'react'
import { Row, Col, Nav, Tab } from 'react-bootstrap'
import Link from 'next/link';
import { GestaoTabNav, GestaoTabLink } from 'styles/Gestao'





const GestaoTab = (props) => {

    return (

        <Tab.Container defaultActiveKey={props.defaultActive}>
            <Row>
                <Col sm={{ span: 3, offset: 9 }}>
                    <GestaoTabNav className="mr-auto">
                        <Nav.Item>
                            <Link href="#" /* as={`/gestao/kanban/${id}`} */ passHref>
                                <GestaoTabLink eventKey="kanban">
                                    
                                        Kanban
                                    
                                </GestaoTabLink>
                            </Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link href="#" /* as={`/gestao/listagem/${id}`} */ passHref>
                                <GestaoTabLink eventKey="listing">
                                    Listagem
                                </GestaoTabLink>
                            </Link>
                        </Nav.Item>
                    </GestaoTabNav>
                </Col>
            </Row>
        </Tab.Container>


    )
}
export default GestaoTab;