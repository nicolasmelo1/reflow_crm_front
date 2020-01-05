import React from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import GestaoModal from './GestaoModal'


const GestaoButton = () => {
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button style={{ border: "1px solid #707070", position: "fixed", bottom: "0", right: "0", marginRight: "50px", width: "350px", height: "83px", borderRadius: "20px 20px 0 0", background: "#0dbf7e" }} size="lg" onClick={handleShow}>
                <span style={{ fontWeight: "400", fontSize: "30px" }}>Adicionar Novo</span>
            </Button>

            <Modal size="xl" style={{borderRadius: "30px 30px 30px 30px"}} show={show} onHide={handleClose}>
                
                <Modal.Header style={{background:"#424242",  }}closeButton>
                    <Modal.Title style={{color:"white", fontWeight:"700"}}>
                        <Button style={{borderRadius:"20px", background:"#0dbf7e", padding: "15px 55px 15px 55px", fontSize:"20px", marginRight: "13px"}}>Editar campos</Button> 
                                    Clique no botão para editar os campos desta entrada
                        
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>>
                    <Form>

                        <h1 style={{color:"#0e5741", fontSize:"30px", fontWeight:"700"}}>Informações Gerais</h1>
                        <Form.Group>
                            <Form.Label style={{color:"#444444", fontSize:"20px", fontWeight:"700"}}>Cliente</Form.Label>
                            <Form.Control />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{color:"#444444", fontSize:"20px", fontWeight:"700"}}>Filial</Form.Label>
                            <Form.Control />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{color:"#444444", fontSize:"20px", fontWeight:"700"}}>Responsável</Form.Label>
                            <Form.Control />
                        </Form.Group>

                        <h1 style={{color:"#0e5741", fontSize:"30px", fontWeight:"700"}}>Informações da conta</h1>
                        <Form.Group >
                            <Form.Label style={{color:"#444444", fontSize:"20px", fontWeight:"700"}}>Valor</Form.Label>
                            <Form.Control />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{color:"#444444", fontSize:"20px", fontWeight:"700"}}>Expectativa</Form.Label>
                            <Form.Control />
                        </Form.Group>

                        <h1 style={{color:"#0e5741", fontSize:"30px", fontWeight:"700"}}>Datas</h1>
                        <Form.Group >
                            <Form.Label style={{color:"#444444", fontSize:"20px", fontWeight:"700"}}>Data de atualização</Form.Label>
                            <Form.Control />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{color:"#444444", fontSize:"20px", fontWeight:"700"}}>Data de Inclusão</Form.Label>
                            <Form.Control />
                        </Form.Group>

                        <h1 style={{color:"#0e5741", fontSize:"30px", fontWeight:"700"}}>Misc.</h1>
                        <Form.Group >
                            <Form.Label style={{color:"#444444", fontSize:"20px", fontWeight:"700"}}>Anexo</Form.Label>
                            <Form.Control />
                            </Form.Group>
                        <Form.Group>
                            <Form.Label style={{color:"#444444", fontSize:"20px", fontWeight:"700"}}>Histórico</Form.Label>
                            <Form.Control />
                            </Form.Group>
                        <Form.Group>
                            <Form.Label style={{color:"#444444", fontSize:"20px", fontWeight:"700"}}>Produto</Form.Label>
                            <Form.Control />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{color:"#444444", fontSize:"20px", fontWeight:"700"}}>Status</Form.Label>
                            <Form.Control />
                        </Form.Group>
                    </Form>
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

export default GestaoButton;