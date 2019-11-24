import Base from '../components/Base';
import Link from 'next/link';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav'
import NavBar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'

const Index = () => {
    return (
        <div id="App">
            <Base>
                <main id="page-wrap">
                    <Container>
                        <Row>
                            <Col lg={{span: 4, offset: 11}}>
                                <Nav className="mr-auto">
                                    <Nav.Item>
                                        <Nav.Link href="#">Kanban</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#">Listagem</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div class="parent">
                                    <style type="text/css">
                                        {`
                                        .inline-block-child {
                                            display: inline-block;
                                        }
                                        `}
                                    </style>
                                    <div class="inline-block-child">
                                        <p>Data de Atualização: </p>
                                    </div>
                                    <div class="inline-block-child">
                                        <Dropdown>
                                            <Dropdown.Toggle  id="dropdown-basic">
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
                            <Col>
                            </Col>
                            

                        </Row>
                        <Row>
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle variant="secondary" id="dropdown-config">
                                        Configurações Obrigatórias
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>config 1</Dropdown.Item>
                                        <Dropdown.Item>config 2</Dropdown.Item>
                                        <Dropdown.Item>config 3</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col lg={{span:1, offset: 8}}>
                                <Button>Filtro</Button>
                            </Col>
                        </Row>
                    </Container>
                </main>
            </Base>
        </div>

    )
}
export default Index;
