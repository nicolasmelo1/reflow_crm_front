import React from 'react'
import Login from '@shared/components/Login'
import Layout from '@shared/components/Layout'
import { strings } from '@shared/utils/constants'

class LoginPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Layout title={strings['pt-br']['loginPageTitle']} hideNavBar={true}>
                <Login/>
            </Layout>
        );
    }
}


export default LoginPage
