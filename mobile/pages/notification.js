import React, { useContext } from 'react'
import Layout from '@shared/components/Layout'
import { View } from 'react-native'
import Notification from '@shared/components/Notification'
import { AuthenticationContext } from '../contexts'

const Notifications = (props) => {
    const authentication = useContext(AuthenticationContext)

    return (
        <Layout navigation={props.navigation} setIsAuthenticated={authentication.setIsAuthenticated}>
            <View>
                <Notification navigation={props.navigation}/>
            </View>
        </Layout>
    )
}

export default Notifications