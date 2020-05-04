import React from 'react'
import Layout from '@shared/components/Layout'
import { Button } from 'react-native'
import { connect } from 'react-redux'
import actions from '@shared/redux/actions'

class Data extends React.Component {
    constructor (props) {
        super(props)   
    }

    render() {
        return (
            <Layout navigation={props.navigation} showSideBar={true}>
                <Button onPress={e=> this.props.onDeauthenticate()} title={'Logout'}/>
            </Layout>
        )     
    }
}

export default connect(state => ({}), actions)(Data)