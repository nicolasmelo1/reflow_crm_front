import React from 'react';
import { Row, Col, Form, Button, Popover, OverlayTrigger, ButtonGroup, Tooltip, Collapse, Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const buttonStyle = {
    margin: "20px",
    height: "189px",
    width: "246px",
    backgroundColor: "#ffffff",
    color: "#0dbf7e"
};

const TemplateTab = (props) => {
    return (
        <>
            <h3>{props.label}</h3>
            <h4>Clique no template escolhido</h4>
            <Container fluid="true">

                <Row>
                    <ButtonGroup>
                        <Button style={buttonStyle}>Teste 1</Button>
                        <Button style={buttonStyle}>Teste</Button>
                        <Button style={buttonStyle}>Teste</Button>
                        <Button style={buttonStyle}>Teste</Button>
                    </ButtonGroup>
                </Row>
                <Row>
                    <ButtonGroup>
                        <Button style={buttonStyle}>Teste</Button>
                        <Button style={buttonStyle}>Teste</Button>
                        <Button style={buttonStyle}>Teste</Button>
                        <Button style={buttonStyle}>Teste</Button>
                    </ButtonGroup>
                </Row>
                <Row>
                    <ButtonGroup>
                        <Button style={buttonStyle}>Teste</Button>
                        <Button style={buttonStyle}>Teste</Button>
                        <Button style={buttonStyle}>Teste</Button>
                        <Button style={buttonStyle}>Teste</Button>
                    </ButtonGroup>
                </Row>
            </Container>
        </>
    )
}

export default TemplateTab;