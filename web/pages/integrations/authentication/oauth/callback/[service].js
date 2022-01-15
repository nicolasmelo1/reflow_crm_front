import React from 'react'
import { withRouter } from 'next/router'
import Layout from '@shared/components/Layout'
import integrations from '@shared/utils/integrations'
import Header from '../../../../../components/Header'


class IntegrationsPage extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const serviceName = this.props.router.query.service
        integrations().handleIntegrationOAuthCallback(serviceName, this.props.router.query).then(_ => {
            window.close()
        })
    }

    render() {
        return (
            <Layout
            isNotLogged={false}
            header={<Header title={'Integração'}/>}
            >
                {'Teste'}
            </Layout>
        )
    }
}

export default withRouter(IntegrationsPage)