import Base from '../../components/Base';
import { useRouter } from 'next/router';

// import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col, Card, Form, Button, Jumbotron, ButtonGroup, OverlayTrigger, Tooltip, Tab, ListGroup } from 'react-bootstrap'
import React from 'react'
import TemplateTab from '../../components/gestao/TemplateTab'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const GestaoTemplate = () => {
    const router = useRouter();
    console.log(router.query);
    return (
        <Base>
            <div id="App">
                <main id="page-wrap" style={{ backgroundColor: "whitesmoke" }}>
                    <Container fluid="true">
                        <Row>
                            <Card>
                                <Tab.Container defaultActiveKey="#vendas">
                                    <Row>
                                        <Col sm={4}>
                                            <h2 style={{ color: "#0e5741" }}>Seleção de templates</h2>
                                            <ListGroup as="ul" variant="flush">
                                                <ListGroup.Item as="li" action href="#vendas">
                                                    Vendas
                                                        </ListGroup.Item>
                                                <ListGroup.Item as="li" action href="#marketing">Marketing</ListGroup.Item>
                                                <ListGroup.Item as="li" action href="#financas">Finanças</ListGroup.Item>
                                                <ListGroup.Item as="li" action href="#ti">T.I.</ListGroup.Item>
                                                <ListGroup.Item as="li" action href="#rh">Recursos Humanos</ListGroup.Item>
                                                <ListGroup.Item as="li" action href="#design">Design</ListGroup.Item>
                                                <ListGroup.Item as="li" action href="#operacoes">Operações</ListGroup.Item>
                                                <ListGroup.Item as="li" action href="#projetos">Projetos</ListGroup.Item>
                                            </ListGroup>
                                        </Col>
                                        <Col sm={8}>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="#vendas">
                                                    <TemplateTab label="Vendas" />
                                                </Tab.Pane>

                                                <Tab.Pane eventKey="#marketing">
                                                    <TemplateTab label="Marketing" />
                                                </Tab.Pane>

                                                <Tab.Pane eventKey="#financas">
                                                    <TemplateTab label="Finanças" />
                                                </Tab.Pane>

                                                <Tab.Pane eventKey="#ti">
                                                    <TemplateTab label="T.I." />
                                                </Tab.Pane>

                                                <Tab.Pane eventKey="#rh">
                                                    <TemplateTab label="Recursos Humanos" />
                                                </Tab.Pane>

                                                <Tab.Pane eventKey="#design">
                                                    <TemplateTab label="Design" />
                                                </Tab.Pane>

                                                <Tab.Pane eventKey="#operacoes">
                                                    <TemplateTab label="Operações" />
                                                </Tab.Pane>

                                                <Tab.Pane eventKey="#projetos">
                                                    <TemplateTab label="Projetos" />
                                                </Tab.Pane>
                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </Card>
                        </Row>
                    </Container>
                </main>
            </div>
        </Base>

    )
}


export default GestaoTemplate;