import React from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Link from 'next/link'
import GestaoEditField from './GestaoEditField'


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
                
                <Modal.Header style={{  }}closeButton>
                    
                </Modal.Header>
                <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                    <Form>
                        <h1 style={{color:"#0e5741", fontSize:"30px", fontWeight:"700"}}>Informações Gerais</h1>
                        <GestaoEditField label="Cliente"/>
                        <GestaoEditField label="Filial"/>
                        <GestaoEditField label="Responsável"/>
                        
                        <h1 style={{color:"#0e5741", fontSize:"30px", fontWeight:"700"}}>Informações da conta</h1>
                        <GestaoEditField label="Valor"/>
                        <GestaoEditField label="Expectativa"/>
                        <h1 style={{color:"#0e5741", fontSize:"30px", fontWeight:"700"}}>Datas</h1>
                        <GestaoEditField label="Data de atualização"/>
                        <GestaoEditField label="Data de inclusão"/>

                        <h1 style={{color:"#0e5741", fontSize:"30px", fontWeight:"700"}}>Misc.</h1>
                        <GestaoEditField label="Anexo"/>
                        <GestaoEditField label="Histórico"/>
                        <GestaoEditField label="Produto"/>
                        <GestaoEditField label="Status"/>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Link href="/gestao/edit" passhref><Button variant="secondary">
                        Expandir tela
                    </Button>
                    </Link>
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