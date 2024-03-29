import React from "react"
import { connect } from 'react-redux'
import Router, { withRouter } from 'next/router'
import Header from '../../../components/Header'
import actions from '@shared/redux/actions'
import { Layout, APIDocumentation } from '@shared/components'

/**
 * @param {String} teste - asdadasd
 */
class APIDocumentationPage extends React.Component {
    render() {
        return (
            <Layout 
            showSideBar={false} 
            header={<Header title={'Documentação da API (Beta)'}/>}
            >
                <APIDocumentation
                formName={this.props.router.query.form} 
                />
            </Layout>
        )
    }
}


export default withRouter(APIDocumentationPage)