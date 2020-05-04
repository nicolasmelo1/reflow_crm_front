import React from 'react'
import Layout from '@shared/components/Layout'
import Login from '@shared/components/Login'
import { View } from 'react-native'

const LoginPage = (props) => {
    console.log('teste2')
    console.log(props.route)
    return (
        <Layout navigation={props.navigation}>
            <Login navigation={props.navigation}/>
        </Layout>
    )
}

export default LoginPage