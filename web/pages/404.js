import { Layout, Error404 } from '@shared/components';

export default function Custom404() {
    return (
        <Layout title={'Reflow - Não conseguimos encontrar a pagina'}>
            <Error404/>
        </Layout>
    )
}