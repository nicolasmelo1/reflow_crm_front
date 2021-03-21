import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import { Layout, FormularyPublic } from '@shared/components'
import actions from '@shared/redux/actions'
import Header from '../../../../components/Header'

/**
 * This is a public page, the user doesn't need to be logged in to go to this page
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class PublicFormularyPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render = () => {
        return (
            <Layout 
            publicAccessKey={this.props.router.query.public_access_key}
            companyId={this.props.router.query.companyId} 
            hideNavBar={true} 
            header={<Header title={'Reflow Forms'}/>}>
                <FormularyPublic
                formName={this.props.router.query.form}
                />
            </Layout>
        )
    }
    //########################################################################################//
}

export default connect(state => ({ }), actions)(withRouter(PublicFormularyPage))
