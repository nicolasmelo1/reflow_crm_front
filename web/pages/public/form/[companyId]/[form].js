import React from 'react'
import {Formulary, Layout} from '@shared/components'
import agent from '@shared/utils/agent'
import actions from '@shared/redux/actions'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import Header from '../../../../components/Header'

/**
 * This is a public page, the user doesn't need to be logged in to go to this page
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class PublicFormularyPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasSubmittedForm: false
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user saves the formulary we show the user a message thanking for filling the formulary.
     */
    onSaveFormulary = () => {
        this.setState(state => ({
            ...state,
            hasSubmittedForm: true
        }))
    }
    // ------------------------------------------------------------------------------------------
    //########################################################################################//
    render = () => {
        return (
            <Layout 
            publicAccessKey={this.props.router.query.public_access_key}
            companyId={this.props.router.query.companyId} 
            hideNavBar={true} 
            header={<Header title={'Reflow Forms'}/>}>
                {this.state.hasSubmittedForm ? (
                    <div>
                        {'Obrigado por preencher o formulário'}
                    </div>
                ) : (
                    <Formulary 
                    display={'standalone'}
                    type='embbed'
                    onSaveFormulary={this.onSaveFormulary}
                    formName={this.props.router.query.form} 
                    />
                )}
            </Layout>
        )
    }
    //########################################################################################//
}

export default connect(state => ({ }), actions)(withRouter(PublicFormularyPage))