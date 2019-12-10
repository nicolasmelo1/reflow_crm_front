import React from 'react'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Row from 'react-bootstrap/Row'
import ListagemCard from './ListagemCard'
import ListagemTable from './ListagemTable'
import Button from 'react-bootstrap/Button'
import CardGroup from 'react-bootstrap/CardGroup'

const ListagemPane = () => {
    return (
        <div className="listagem-pane">
            
            <Col sm={{ span: 6}}>
                <div class="parent">
                    <style type="text/css">
                        {`
                        .inline-block-child {
                        display: inline-block;
                        }
                        `}
                    </style>
                    <div class="inline-block-child">
                        <p style={{ color: "#444444", fontSize: "30px", fontWeight: "600", fontStyle: "italic", fontFamily: "Segoe UI" }}>Data de Atualização: </p>
                    </div>
                    <div class="inline-block-child">
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" style={{ backgroundColor: "Transparent", color: "#0dbf7e", outline: "none", border: "none", fontSize: "30px", fontWeight: "600" }}>
                                16/07/2019 - 13/09/2019
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>16/07/2019 - 13/09/2019</Dropdown.Item>
                                <Dropdown.Item>17/05/2019 - 15/07/2019</Dropdown.Item>
                                <Dropdown.Item>19/03/2019 - 16/05/2019</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </Col>
            <Row>
                <Col sm={{ span: 5,  }}>
                <p>Totais</p>
                </Col>
            </Row>
            <Row>
                <Col sm={{span: "auto", }}>
                {/* <Col sm="auto"> */}
                    <CardGroup>
                        <ListagemCard />
                        <ListagemCard />
                    </CardGroup>
                </Col>
            </Row>
            <Row>
                <Col sm={{span: 2, }}>
                <Button size="sm">Filtro</Button>
                <Button size="sm">Extrair</Button>
                </Col>
                <Col sm={{ span: 4, offset: 5 }}>
                    <Dropdown>
                        <Dropdown.Toggle size="sm" variant="secondary" id="dropdown-config" block>
                            Configurações Obrigatórias
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>config 1</Dropdown.Item>
                            <Dropdown.Item>config 2</Dropdown.Item>
                            <Dropdown.Item>config 3</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            <Row>
                <Col sm={{span: 11}}>
                <ListagemTable />
                </Col>
            </Row>
        </div>
    )
}

export default ListagemPane;