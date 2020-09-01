import React, { useContext } from 'react'
import Layout from '@shared/components/Layout'
import Onboarding from '@shared/components/Onboarding'
import * as WebBrowser from 'expo-web-browser';
import { AuthenticationContext } from '../contexts'
import { View } from 'react-native'

const OnboardingPage = (props) => {
    const authentication = useContext(AuthenticationContext)

    const openLinks = (url) => {
        WebBrowser.openBrowserAsync(url);
    }

    return (
        <Layout setIsAuthenticated={authentication.setIsAuthenticated} isNotLogged={true}>
            <Onboarding openLinks={openLinks}/>
        </Layout>
    )
}

export default OnboardingPage