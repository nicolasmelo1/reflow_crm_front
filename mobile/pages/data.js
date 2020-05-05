import React from 'react'
import Layout from '@shared/components/Layout'
import { Button } from 'react-native'
import { connect } from 'react-redux'
import actions from '@shared/redux/actions'
import { AuthenticationContext } from '../contexts'


class Data extends React.Component {
    constructor (props) {
        super(props)
    }
    
    static contextType = AuthenticationContext;
    
    render() {
        return (
            <Layout setIsAuthenticated={this.context.setIsAuthenticated} showSideBar={true}>
                <Button onPress={e=> {
                    this.props.onDeauthenticate().then(_ => {
                        this.context.setIsAuthenticated(false)
                    })
                }} title={'Logout'}/>
            </Layout>
        )     
    }
}

export default connect(state => ({}), actions)(Data)