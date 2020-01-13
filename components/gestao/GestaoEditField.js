import React from 'react';
import { Row, Col, Form, Button, Popover, OverlayTrigger, ButtonGroup, Tooltip, Collapse } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const GestaoEditField = (props) => {

    

    const [open, setOpen] = React.useState(false);

    if (props.label == "+") {
        return (
            <>
            <Form.Group>
                <Form.Label style={{ color: "#444444", fontSize: "20px", fontWeight: "700" }}>{props.label}</Form.Label>
                <br />
                <Button onClick={() => setOpen(true)} aria-controls="example-collapse-text" aria-expanded={open} style={{ background: "white", color: "white", width: "300px", height: '27px' }}>+</Button>
                <Collapse in={open}>
                    <Form>
                        <h3>Novo Campo</h3>

                        <h4>Tipo de campo</h4>
                        <ButtonGroup>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>Conexão</Tooltip>} >
                                <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="link" style={{ width: "24px", color: "#ffffff" }} /></Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>Opção</Tooltip>} >
                                <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="check-square" style={{ width: "24px", color: "#ffffff" }} /></Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>Seleção múltipla</Tooltip>} >
                                <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="clipboard-list" style={{ width: "24px", color: "#ffffff" }} /></Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>Texto</Tooltip>} >
                                <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="paragraph" style={{ width: "24px", color: "#ffffff" }} /></Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>Anexo</Tooltip>} >
                                <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="file-pdf" style={{ width: "24px", color: "#ffffff" }} /></Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>Período</Tooltip>} >
                                <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="ruler-horizontal" style={{ width: "24px", color: "#ffffff" }} /></Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>Número</Tooltip>} >
                                <Button style={{ height: "50px", width: "50px", background: "#666666", color: "white", fontWeight: "700", fontSize: "13px" }}>123</Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>E-mail</Tooltip>} >
                                <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="envelope" style={{ width: "24px", color: "#ffffff" }} /></Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>Data</Tooltip>} >
                                <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="calendar-alt" style={{ width: "24px", color: "#ffffff" }} /></Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>Fórmula</Tooltip>} >
                                <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="square-root-alt" style={{ width: "24px", color: "#ffffff" }} /></Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>Telefone</Tooltip>} >
                                <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="phone" style={{ width: "24px", color: "#ffffff" }} /></Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>Texto grande</Tooltip>} >
                                <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="align-left" style={{ width: "24px", color: "#ffffff" }} /></Button>
                            </OverlayTrigger>
                        </ButtonGroup>

                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Campo obrigatório" />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Título invisível" />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Campo invisível" />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Campo de valores únicos" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nome do campo</Form.Label>
                            <Form.Control />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Texto de ajuda do campo</Form.Label>
                            <Form.Control />
                        </Form.Group>
                    </Form>
                    
                </Collapse>

            </Form.Group>
            </>
        )
    }
    return (
        <Form.Group>
            <Form.Label style={{ color: "#444444", fontSize: "20px", fontWeight: "700" }}>{props.label}</Form.Label>
            <br />
            <Button onClick={() => setOpen(true)} aria-controls="example-collapse-text"
                aria-expanded={open} style={{ background: "white", color: "white", width: "300px", height: '27px' }} />
            <Collapse in={open}>
                <Form>
                    <h4>Tipo de campo</h4>
                    <ButtonGroup>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Conexão</Tooltip>} >
                            <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="link" style={{ width: "24px", color: "#ffffff" }} /></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Opção</Tooltip>} >
                            <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="check-square" style={{ width: "24px", color: "#ffffff" }} /></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Seleção múltipla</Tooltip>} >
                            <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="clipboard-list" style={{ width: "24px", color: "#ffffff" }} /></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Texto</Tooltip>} >
                            <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="paragraph" style={{ width: "24px", color: "#ffffff" }} /></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Anexo</Tooltip>} >
                            <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="file-pdf" style={{ width: "24px", color: "#ffffff" }} /></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Período</Tooltip>} >
                            <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="ruler-horizontal" style={{ width: "24px", color: "#ffffff" }} /></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Número</Tooltip>} >
                            <Button style={{ height: "50px", width: "50px", background: "#666666", color: "white", fontWeight: "700", fontSize: "13px" }}>123</Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>E-mail</Tooltip>} >
                            <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="envelope" style={{ width: "24px", color: "#ffffff" }} /></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Data</Tooltip>} >
                            <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="calendar-alt" style={{ width: "24px", color: "#ffffff" }} /></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Fórmula</Tooltip>} >
                            <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="square-root-alt" style={{ width: "24px", color: "#ffffff" }} /></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Telefone</Tooltip>} >
                            <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="phone" style={{ width: "24px", color: "#ffffff" }} /></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Texto grande</Tooltip>} >
                            <Button style={{ height: "50px", width: "50px", background: "#666666" }}><FontAwesomeIcon icon="align-left" style={{ width: "24px", color: "#ffffff" }} /></Button>
                        </OverlayTrigger>
                    </ButtonGroup>

                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Campo obrigatório" />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Título invisível" />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Campo invisível" />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Campo de valores únicos" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Nome do campo</Form.Label>
                        <Form.Control />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Texto de ajuda do campo</Form.Label>
                        <Form.Control />
                    </Form.Group>
                </Form>
                
            </Collapse>

        </Form.Group>
    )
}

export default GestaoEditField;