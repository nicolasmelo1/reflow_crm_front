import React from 'react'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Row from 'react-bootstrap/Row'
import KanbanMain from './KanbanMain'
import Button from 'react-bootstrap/Button'

const KanbanPane = () => {
    return (
        <div className="kanban-pane">
            <Col sm={{ span: 6 }}>
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
                <Col sm={{ span: 3, }}>
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-config" size="sm">
                            Configurações Obrigatórias
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>config 1</Dropdown.Item>
                            <Dropdown.Item>config 2</Dropdown.Item>
                            <Dropdown.Item>config 3</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col lg={{ span: 2, offset: 10 }}>
                    <Button size="sm">Filtro</Button>
                </Col>
            </Row>
            <KanbanMain />
        </div>
    )
}

export default KanbanPane;