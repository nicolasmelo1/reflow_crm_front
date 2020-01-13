import Base from '../../components/Base';
import { useRouter } from 'next/router';

// import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'

import NotaFiscal from '../../components/configs/NotaFiscal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import React from 'react'

import Card from 'react-bootstrap/Card'

import TabelaPagamentos from '../../components/configs/TabelaPagamentos';
import { Button } from 'react-bootstrap';
import BotaoPagamento from '../../components/configs/BotaoPagamento';

const GestaoEdit = () => {
    const router = useRouter();
    console.log(router.query);
    return (
        <Base>
            <div id="App">
                <main id="page-wrap" style={{ backgroundColor: "whitesmoke" }}>
                    <Container fluid="true">
                        <Row>
                            <Col>
                                
                                <Card style={{width:'100%', marginTop:'20px'}}>
                                    <Row>
                                        <Col>
                                            <TabelaPagamentos />
                                        </Col>
                                        <Col sm={{ offset: 6}}>
                                            <NotaFiscal />
                                        </Col>
                                    </Row>
                                    <BotaoPagamento />
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </main>
            </div>
        </Base >
    );
}


export default GestaoEdit;