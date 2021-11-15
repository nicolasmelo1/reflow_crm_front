import React from 'react'
import Onboarding from '@shared/components/Onboarding'
import Layout from '@shared/components/Layout'
import { strings } from '@shared/utils/constants'
import { withRouter } from 'next/router'
import Header from '../../components/Header'


class OnboardingPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            addTemplates: false
        }
    }

    setAddTemplates = (data) => this.setState(state => state.addTemplates = data)

    render() {
        return (
            <Layout 
            addTemplates={this.state.addTemplates} 
            hideNavBar={true} 
            isNotLogged={true} 
            header={<Header title={strings['pt-br']['onboardingPageTitle']}/>}>
                <Onboarding 
                setAddTemplates={this.setAddTemplates}
                partner={this.props.router?.query?.partner} 
                sharedBy={this.props.router?.query?.shared_by}
                discountCoupon={this.props.router?.query?.coupon}
                />
            </Layout>
        )
    }
}


export default withRouter(OnboardingPage)
