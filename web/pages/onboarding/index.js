import React from 'react'
import Onboarding from '@shared/components/Onboarding'
import Layout from '@shared/components/Layout'
import { strings } from '@shared/utils/constants'

class OnboardingPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Layout title={'Quero ser Reflow'} hideNavBar={true} isNotLogged={true}>
                <Onboarding/>
            </Layout>
        );
    }
}


export default OnboardingPage
