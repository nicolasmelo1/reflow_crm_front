import React from 'react'
import { withRouter } from 'next/router'
import Layout from '@shared/components/Layout'
import integrations from '@shared/utils/integrations'
import { strings } from '@shared/utils/constants'
import Header from '../../../../../components/Header'

/**
 * This page will be used for OAuth authentication. This is exactly the callback page for the OAuth authentication. 
 * You might ask, why make this on the front and not the back? well, the reason is that the storage exists only on the front end.
 * And for storage i mean the access token and the refresh token.
 */
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
            showSideBar={false}
            hideNavBar={true}
            isNotLogged={false}
            header={<Header title={strings['pt-br']['integrationPageTitle']}/>}
            />
        )
    }
}

export default withRouter(IntegrationsPage)