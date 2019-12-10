import Base from '../components/Base';
import Sidebar from "../components/Sidebar"
// import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import GestaoTab from '../components/gestao/GestaoTab'
import KanbanList from '../components/kanban/KanbanList'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import GestaoButton from '../components/gestao/GestaoButton'

const Index = () => {
    return (
        <body>
            <div id="App">
                
                <Base>
                    <main id="page-wrap" style={{backgroundColor:"whitesmoke"}}>
                        <Container fluid="true">
                            <Sidebar/>
                            <GestaoTab />
                            <GestaoButton />
                        </Container>
                    </main>
                </Base>
            </div>
        </body>
    )
}
export default Index;
