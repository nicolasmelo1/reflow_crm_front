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
            onboardingStep: 0,
            addTemplates: false
        }
    }

    setAddTemplates = (data) => this.setState(state => ({
        ...state,
        addTemplates: data,
        onboardingStep: data ? 0 : 2
    }))

    render() {
        return (
            <Layout 
            setAddTemplates={this.setAddTemplates}
            addTemplates={this.state.addTemplates} 
            hideNavBar={true} 
            isNotLogged={true} 
            header={<Header title={strings['pt-br']['onboardingPageTitle']}/>}>
                <Onboarding 
                step={this.state.onboardingStep}
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
