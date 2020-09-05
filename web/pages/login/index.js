import React from 'react'
import Login from '@shared/components/Login'
import Layout from '@shared/components/Layout'
import { strings } from '@shared/utils/constants'
import Header from '../../components/Header'

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
            <Layout addTemplates={this.state.addTemplates} hideNavBar={true} isNotLogged={true}>
                <Header title={strings['pt-br']['loginPageTitle']}/>
                <Login setAddTemplates={this.setAddTemplates}/>
            </Layout>
        );
    }
}


export default LoginPage
