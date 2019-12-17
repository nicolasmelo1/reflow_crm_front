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
            <Button style={{border:"1px solid #707070", position: "fixed", bottom: "0", right: "0", marginRight: "50px", width: "350px", height:"83px", borderRadius:"20px 20px 0 0", background:"#0dbf7e"}} size="lg" onClick={handleShow}>
                <span style={{fontWeight:"400", fontSize:"30px"}}>Adicionar Novo</span>
            </Button>

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <Button>Editar campos</Button> Clique no botão para editar os campos desta entrada!
                    </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <h1>Informações Gerais</h1>
                    <Form.Group>
                        <Form.Label>Cliente</Form.Label>
                        <Form.Control />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Filial</Form.Label>
                        <Form.Control />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Responsável</Form.Label>
                        <Form.Control />
                    </Form.Group>
                    <h1>Informações da conta</h1>
                    <Form.Group >
                        <Form.Label>Valor</Form.Label>
                        <Form.Control />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Expectativa</Form.Label>
                        <Form.Control />
                    </Form.Group>
                    
                    <Button variant="primary" type="submit">
                        Submit
                        </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                    </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                    </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default GestaoButton;