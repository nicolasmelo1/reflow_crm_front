import react from 'react'
import { Col, Dropdown, Button, Modal, Row, Form, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function ConfigModal(props) {
    return (
        <Modal {...props} style={{borderRadius: "10px", }} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <Form>
                            <Form.Check type="checkbox" label="Utilizar este modelo como padrão para a empresa" style={{ color: "#0dbf7e", fontWeight: "700", fontSize: "20px" }} />
                        </Form>
                    </Col>
                    <Col>
                        <p style={{ color: '#707070', fontSize: 20, fontWeight: '700' }}>
                            Esta visualização será padrão para todos que utilizarem esta página e a dimensão do kanban não poderá ser alterada
                            </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3 style={{color: '#0e5741',fontFamily: 'Segoe UI',fontSize: 30,fontWeight: '700'}}>Dimensão</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-config" size="sm" style={{ background: "white", color: "#444444", borderRadius:"10px", boxShadow: "0 3px 6px rgba(0,0,0,0.3" }} >
                                <span style={{ fontSize: "15px", fontWeight: "700", color:"#bfbfbf" }}>
                                    Escolha uma das opções
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>config 1</Dropdown.Item>
                                <Dropdown.Item>config 2</Dropdown.Item>
                                <Dropdown.Item>config 3</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                    <p style={{ color: '#707070', fontSize: 20, fontWeight: '700' }}>A dimensão refere-se à separação dos seus processos em colunas</p></Col>
                </Row>
                <Row>
                    <Col sm={{span: 1}}>
                        <h3 style={{color: '#0e5741',fontFamily: 'Segoe UI',fontSize: 30,fontWeight: '700'}}>Cards</h3>
                    </Col>
                    <Col sm={{span:1}}>    
                        <Button style={{borderRadius:"100%", background:"#0dbf7e", borderColor: "#0dbf7e"}}> + </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card style={{ width: '365px', marginBottom: "10px", borderRadius: "10px", boxShadow: "0 3px 6px rgba(0,0,0,0.3" }}>
                            <Card.Body style={{ padding: '10px', paddingLeft: '24px' }}>

                                <FontAwesomeIcon style={{ width: "20px", color: "#444444", position: "absolute", right: "22px", top: "16px" }} icon="arrows-alt" />
                                <FontAwesomeIcon style={{ width: "23px", color: "#0dbf7e", position: "absolute", right: "24px", bottom: "12px" }} icon="edit" />
                                <FontAwesomeIcon style={{ width: "23px", color: "#0dbf7e", position: "absolute", right: "57px", bottom: "12px" }} icon="cloud-upload-alt" />

                                <Card.Title >
                                    <span style={{ color: "#444444", fontSize: "24px", fontWeight: 400, fontFamily: "Segoe UI" }}>Nome do Cliente</span>
                                </Card.Title>

                                <Card.Subtitle>
                                    <span style={{ color: "#707070", fontSize: "20px", fontWeight: 400, fontFamily: "Segoe UI" }}>Comercial</span>
                                </Card.Subtitle>

                                <Card.Text>
                                    <span style={{ color: "#707070", fontSize: "20px", fontWeight: 400, fontFamily: "Segoe UI" }}>Valor</span>
                                </Card.Text>

                                <footer>
                                    <span style={{ color: "#707070", fontSize: "20px", fontWeight: 400, fontFamily: "Segoe UI" }}>Expectativa</span>
                                </footer>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <p style={{ color: '#707070', fontSize: 20, fontWeight: '700' }}>Edite quais são as informações que você gostaria e visualizar dentro de cada card</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={{span:3}}>
                        <h3 style={{color: '#0e5741',fontFamily: 'Segoe UI',fontSize: 30,fontWeight: '700'}}>Lógica de cores</h3>
                    </Col>
                    <Col sm={{span:1}}>    
                        <Button style={{borderRadius:"100%", background:"#0dbf7e", borderColor: "#0dbf7e"}}> + </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p style={{color: '#444444',fontSize: '20',fontWeight: '700'}}>Quando o campo:</p>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-config" size="sm" style={{ background: "white", color: "#444444", borderRadius:"10px", boxShadow: "0 3px 6px rgba(0,0,0,0.3" }} >
                                <span style={{ fontSize: "15px", fontWeight: "700", color:"#bfbfbf" }}>
                                    Escolha uma das opções
                            </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>Comercial</Dropdown.Item>
                                <Dropdown.Item>Valor</Dropdown.Item>
                                <Dropdown.Item>Expectativa</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <p style={{color: '#444444',fontSize: '20',fontWeight: '700'}}>
                            For
                        </p>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-config" size="sm" style={{ background: "white", color: "#444444", borderRadius:"10px", boxShadow: "0 3px 6px rgba(0,0,0,0.3" }} >
                                <span style={{ fontSize: "15px", fontWeight: "700", color:"#bfbfbf" }}>
                                    Escolha uma das opções
                            </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>config 1</Dropdown.Item>
                                <Dropdown.Item>config 2</Dropdown.Item>
                                <Dropdown.Item>config 3</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <p style={{color: '#444444',fontSize: '20',fontWeight: '700'}}>À</p>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-config" size="sm" style={{ background: "white", color: "#444444", borderRadius:"10px", boxShadow: "0 3px 6px rgba(0,0,0,0.3" }} >
                                <span style={{ fontSize: "15px", fontWeight: "700", color:"#bfbfbf" }}>
                                    Escolha uma das opções
                            </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>config 1</Dropdown.Item>
                                <Dropdown.Item>config 2</Dropdown.Item>
                                <Dropdown.Item>config 3</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <p style={{color: '#444444',fontSize: '20',fontWeight: '700'}}>Cor</p>
                        <input type="color" name="favcolor" value="#ff0000"/>
                    </Col>
                    <Col>
                    <p style={{ color: '#707070', fontSize: 20, fontWeight: '700' }}>Facilite a visualização utilizando cores nos cards</p></Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}



const KanbanConfig = () => {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <Col sm={{ span: 3, }}>
            <Button style={{ background: "#444444", borderRadius: "20px" }} onClick={() => setModalShow(true)}>
                Configurações Obrigatórias
            </Button>

            <ConfigModal show={modalShow} onHide={() => setModalShow(false)} />



        </Col>
    )
}
export default KanbanConfig;