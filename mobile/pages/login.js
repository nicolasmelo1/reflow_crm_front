import React, { useContext } from 'react'
import Layout from '@shared/components/Layout'
import Login from '@shared/components/Login'
import { AuthenticationContext } from '../contexts'
import { View } from 'react-native'

const LoginPage = (props) => {
    const authentication = useContext(AuthenticationContext)
    
    console.log(authentication.setIsAuthenticated)
    return (
        <Layout setIsAuthenticated={authentication.setIsAuthenticated}>
            <Login setIsAuthenticated={authentication.setIsAuthenticated}/>
        </Layout>
    )
}

export default LoginPage