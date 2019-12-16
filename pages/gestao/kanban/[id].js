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

const GestaoKanban = ()  => {
    const router = useRouter();
    console.log(router.query);
    return (
        <Base>
            <body>
                <div id="App">
                    <main id="page-wrap" style={{ backgroundColor: "whitesmoke" }}>
                        <Container fluid="true">
                            <Sidebar id={router.query.id}/>
                            <GestaoTab id={router.query.id}/>
                            <GestaoButton />
                        </Container>
                    </main>

                </div>
            </body>
        </Base>
    );
}


GestaoKanban.getInitialProps = async () => {
    return {};
  };

export default GestaoKanban;