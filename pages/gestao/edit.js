import Base from '../../components/Base';
import { useRouter } from 'next/router';
import Sidebar from "../../components/Sidebar"
// import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col, Card, Form, Button, Jumbotron, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap'
import React from 'react'
import GestaoEditField from '../../components/gestao/GestaoEditField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const GestaoEdit = () => {
    const router = useRouter();
    console.log(router.query);
    return (
        <Base>
            <div id="App">
                <main id="page-wrap" style={{ backgroundColor: "whitesmoke" }}>
                    <Container fluid="true">
                        <Sidebar id={router.query.id} />
                        <Row>
                            <Col sm={{ offset: 1 }}>
                                <Card style={{ borderRadius: "30px 30px 30px 30px" }}>
                                    <Card.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
                                        <Form>

                                            <GestaoEditField label="Adicionar Campo"/>
                                            <h1 style={{ color: "#0e5741", fontSize: "30px", fontWeight: "700" }}>Informações Gerais</h1>
                                            <GestaoEditField label="Cliente" />
                                            <GestaoEditField label="Filial" />
                                            <GestaoEditField label="Responsável" />

                                            <h1 style={{ color: "#0e5741", fontSize: "30px", fontWeight: "700" }}>Informações da conta</h1>
                                            <GestaoEditField label="Valor" />
                                            <GestaoEditField label="Expectativa" />
                                            <h1 style={{ color: "#0e5741", fontSize: "30px", fontWeight: "700" }}>Datas</h1>
                                            <GestaoEditField label="Data de atualização" />
                                            <GestaoEditField label="Data de inclusão" />

                                            <h1 style={{ color: "#0e5741", fontSize: "30px", fontWeight: "700" }}>Misc.</h1>
                                            <GestaoEditField label="Anexo" />
                                            <GestaoEditField label="Histórico" />
                                            <GestaoEditField label="Produto" />
                                            <GestaoEditField label="Status" />
                                        </Form>
                                    </Card.Body>
                                    <Card.Footer>
                                        <Button variant="primary">
                                            Salvar mudanças
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                            <Col>
                                <h1 style={{ color: "#0e5741", fontSize: "30px", fontWeight: "700" }}>Histórico de utilização</h1>
                                <div class="container">
                                    <div class="card flex-row flex-wrap">
                                        <div class="card-header border-0">
                                            <FontAwesomeIcon icon="clock" style={{ width: "45px", color: "#444444" }} />
                                        </div>
                                        <div class="card-block px-2">
                                            <div class="card-title">
                                                10/09/2019
                                            </div>
                                            <div class="card-text">
                                                Lucas editou o campo Status de Negociação para Fechado
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div class="container">
                                    <div class="card flex-row flex-wrap">
                                        <div class="card-header border-0">
                                            <FontAwesomeIcon icon="clock" style={{ width: "45px", color: "#444444" }} />
                                        </div>
                                        <div class="card-block px-2">
                                            <div class="card-title">
                                                07/09/2019
                                            </div>
                                            <div class="card-text">
                                                Lucas editou o campo valor de 5.000 para 4.000
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div class="container">
                                    <div class="card flex-row flex-wrap">
                                        <div class="card-header border-0">
                                            <FontAwesomeIcon icon="clock" style={{ width: "45px", color: "#444444" }} />
                                        </div>
                                        <div class="card-block px-2">
                                            <div class="card-title">
                                                05/09/2019
                                            </div>
                                            <div class="card-text">
                                                Lucas adicionou Histórico com Cliente pediu desconto de 5% e enviou a documentação faltante
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div class="container">
                                    <div class="card flex-row flex-wrap">
                                        <div class="card-header border-0">
                                            <FontAwesomeIcon icon="clock" style={{ width: "45px", color: "#444444" }} />
                                        </div>
                                        <div class="card-block px-2">
                                            <div class="card-title">
                                                01/09/2019
                                            </div>
                                            <div class="card-text">
                                                Lucas incluiu Formulário
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </main>
            </div>
        </Base >
    );
}


export default GestaoEdit;