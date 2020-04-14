import { Layout, Error404 } from 'components';

export default function Custom404() {
    return (
        <Layout title={'Reflow - Não conseguimos encontrar a pagina'}>
            <Error404/>
        </Layout>
    )
}