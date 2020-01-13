import React from 'react';
import { Button, Modal, Form, Tab, Tabs, ButtonGroup, ToggleButton, Row, Col} from 'react-bootstrap';
import Link from 'next/link';



const BotaoPagamento = () => {
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button style={{ border: "1px solid #707070", position: "fixed", bottom: "0", right: "0", marginRight: "50px", width: "350px", height: "83px", borderRadius: "20px 20px 0 0", background: "#0dbf7e" }} size="lg" onClick={handleShow}>
                <span style={{ fontWeight: "400", fontSize: "30px" }}>Pagamento</span>
            </Button>

            <Modal size="xl" style={{ borderRadius: "30px 30px 30px 30px" }} show={show} onHide={handleClose}>

                <Modal.Header style={{ background: "#424242", }} closeButton />

                <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
                <Tabs defaultActiveKey="credito">
                        <Tab eventKey="credito" title="Cartão de Crédito">
                            <h2>Data de Cobrança</h2>
                            <ButtonGroup toggle>
                                <ToggleButton type="radio" name="radio" defaultchecked value="1">1</ToggleButton>
                                <ToggleButton type="radio" name="radio" defaultchecked value="4">4</ToggleButton>
                                <ToggleButton type="radio" name="radio" defaultchecked value="15">15</ToggleButton>
                                <ToggleButton type="radio" name="radio" defaultchecked value="25">25</ToggleButton>
                            </ButtonGroup>

                            <h2>E-mails de cobrança</h2>
                            <Form>
                                <Form.Group>
                                    <Form.Text className="text-muted">As cobranças e recibos serão enviadas para os e-mails cadastrados.</Form.Text>
                                    <Form.Control type="email" placeholder="Endereço 1" />
                                    <Form.Control type="email" placeholder="Endereço 2" />
                                </Form.Group>
                            </Form>
                            <h2>Informações de pagamento</h2>
                            <Form>
                                <Form.Group controlId="formCardNumber">
                                    <Form.Label>Número do cartão</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                                <Form.Group controlId="formCardHolderName">
                                    <Form.Label>Nome no cartão</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="formCardExpirationDate">
                                            <Form.Label>Data de Expiração</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="formCardCVV">
                                            <Form.Label>CVV</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                            
                            
                        </Tab>
                        <Tab eventKey="boleto" title="Boleto Bancário" disabled>

                        </Tab>
                    </Tabs>



                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Salvar mudanças
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default BotaoPagamento;