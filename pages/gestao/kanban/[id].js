import Base from '../../../components/Base';
import { useRouter } from 'next/router';
import Sidebar from "../../../components/Sidebar"
// import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import GestaoTab from '../../../components/gestao/GestaoTab'
import KanbanList from '../../../components/kanban/list/KanbanList'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import GestaoButton from '../../../components/gestao/GestaoButton'
import React from 'react'
import KanbanMain from '../../../components/kanban/KanbanMain'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import GestaoDataAtualizacao from '../../../components/gestao/GestaoDataAtualizacao'
import KanbanConfig from '../../../components/kanban/KanbanConfigs'

const GestaoKanban = () => {
    const router = useRouter();
    console.log(router.query);
    return (
        <Base>
                <div id="App">
                    <main id="page-wrap" style={{ backgroundColor: "whitesmoke" }}>
                        <Container fluid="true">
                            
                            <Sidebar id={router.query.id} />    
                            
                            <Col sm={{offset:1, span:11}}>
                                <GestaoTab id={router.query.id} />
                                <div className="kanban-pane">
                                    <Col sm={{ span: 6 }}>
                                        <GestaoDataAtualizacao />
                                    </Col>
                                    <Row>
                                        <KanbanConfig />
                                        <Col lg={{ span: 2, offset: 7 }}>
                                            <Button style={{ background: "#444444", borderRadius: "20px", width: "126px", padding: "5px 5px" }}>
                                                <FontAwesomeIcon icon="filter" style={{ width: "24px", color: "white" }} />
                                                <span style={{ fontSize: "20px", fontWeight: "400" }}> Filtro</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                    <KanbanMain id={router.query.id} />
                                </div>
                                <GestaoButton />
                            </Col>
                        </Container>
                    </main>
                </div>
        </Base>
    );
}


GestaoKanban.getInitialProps = async () => {
    return {};
};

export default GestaoKanban;