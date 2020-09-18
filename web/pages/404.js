import { Layout, Error404 } from '@shared/components';
import Header from '../components/Header'


export default function Custom404() {
    return (
        <Layout header={<Header title={'Reflow - Não conseguimos encontrar a pagina'}/>}>
            <Error404/>
        </Layout>
    )
}