import Base from '../../../components/Base';
import { useRouter } from 'next/router';
import Sidebar from "../../../components/Sidebar"
// import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import GestaoTab from '../../../components/gestao/GestaoTab'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import GestaoButton from '../../../components/gestao/GestaoButton'
import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CardGroup from 'react-bootstrap/CardGroup'
import Button from 'react-bootstrap/Button'
import GestaoDataAtualizacao from '../../../components/gestao/GestaoDataAtualizacao'
import ListagemCard from '../../../components/listagem/ListagemCard'
import ListagemTable from '../../../components/listagem/ListagemTable'

const GestaoListagem = () => {
    const router = useRouter();
    console.log(router.query);
    return (
        <Base>
            <div id="App">
                <main id="page-wrap" style={{ backgroundColor: "whitesmoke" }}>
                    <Container fluid="true">
                        <Sidebar id={router.query.id} />
                        <Col sm={{ offset: 1, span: 11 }}>
                            <GestaoTab id={router.query.id} />
                            <div className="listagem-pane">
                                <Col sm={{ span: 6 }}>
                                    <GestaoDataAtualizacao />
                                </Col>
                                <Row>
                                    <Col sm={{ span: 5, }}>
                                        <p>Totais</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={{ span: "auto", }}>
                                        {/* <Col sm="auto"> */}
                                        <CardGroup>
                                            <ListagemCard />
                                            <ListagemCard />
                                        </CardGroup>
                                    </Col>
                                </Row>
                                <Row style={{marginBottom:"10px"}}>
                                    <Col sm={{ span: 2 }}>
                                        <Button size="sm" style={{ background: "#444444", borderRadius: "20px", width: "126px", padding: "5px 5px" }}> <FontAwesomeIcon icon="filter" style={{ width: "24px", color: "white" }} />Filtro</Button>
                                        <Button size="sm" style={{ background: "#444444", borderRadius: "20px", width: "126px", padding: "5px 5px" }}>Extrair</Button>
                                    </Col>
                                    <Col sm={{span:5, offset: 4 }}>
                                        <Button size="sm" block style={{background: "#444444", borderRadius: "20px", padding: "5px 5px" }}>Todas as colunas selecionadas</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={{ span: 11 }}>
                                        <ListagemTable id={router.query.id} />
                                    </Col>
                                </Row>
                            </div>
                            <GestaoButton />
                        </Col>
                    </Container>
                </main>
            </div>
        </Base >
    );
}


GestaoListagem.getInitialProps = async () => {
    return {};
};

export default GestaoListagem;