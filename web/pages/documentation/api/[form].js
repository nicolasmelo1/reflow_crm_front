import React from "react"
import Router, { withRouter } from 'next/router'
import Header from '../../../components/Header'
import { Layout, APIDocumentation } from '@shared/components'


class APIDocumentationPage extends React.Component {
    
    render() {
        return (
            <Layout 
            showSideBar={false} 
            header={<Header title={'API Documentation'}/>}
            >
                <APIDocumentation
                formName={this.props.router.query.form} 
                />
            </Layout>
        )
    }
}


export default withRouter(APIDocumentationPage)