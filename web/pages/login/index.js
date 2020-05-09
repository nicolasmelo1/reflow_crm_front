import React from 'react'
import Login from '@shared/components/Login'
import Layout from '@shared/components/Layout'
import { strings } from '@shared/utils/constants'

class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            addTemplates: false
        }
    }

    setAddTemplates = (data) => this.setState(state => state.addTemplates = data)

    render() {
        return (
            <Layout addTemplates={this.state.addTemplates} title={strings['pt-br']['loginPageTitle']} hideNavBar={true}>
                <Login setAddTemplates={setAddTemplates}/>
            </Layout>
        );
    }
}


export default LoginPage
