import React from 'react'
import Onboarding from '@shared/components/Onboarding'
import Layout from '@shared/components/Layout'
import { strings } from '@shared/utils/constants'
import { withRouter } from 'next/router'
import Header from '../../components/Header'

class OnboardingPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Layout hideNavBar={true} isNotLogged={true}>
                <Header title={strings['pt-br']['onboardingPageTitle']}/>
                <Onboarding partner={this.props.router?.query?.partner} shared_by={this.props.router?.query?.shared_by}/>
            </Layout>
        )
    }
}


export default withRouter(OnboardingPage)
