import React from 'react'
import Layout from '@shared/components/Layout'
import { Button, Linking } from 'react-native'
import { connect } from 'react-redux'
import actions from '@shared/redux/actions'
import { withAuthenticationContext } from '../contexts'
import Dashboard from '@shared/components/Dashboard'

class Data extends React.Component {
    constructor (props) {
        super(props)
    }


    render() {

        return (
            <Layout setIsAuthenticated={this.props.authenticationContext.setIsAuthenticated} showSideBar={true}>
                <Button onPress={e=> {
                    this.props.onDeauthenticate().then(_ => {
                        this.props.authenticationContext.setIsAuthenticated(false)
                    })
                }} title={'Logout'}/>
                <Dashboard 
                formName={'comercial123'}
                />
            </Layout>
        )     
    }
}

export default connect(state => ({}), actions)(withAuthenticationContext(Data))