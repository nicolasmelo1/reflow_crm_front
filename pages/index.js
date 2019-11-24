import Base from '../components/Base';
import Link from 'next/link';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

const Index = () => {
    return (
        <div id="App">
            <Link href="/gestao"><Button>Entrar</Button></Link>
        </div>

    )
}
export default Index;
