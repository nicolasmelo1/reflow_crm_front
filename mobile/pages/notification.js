import React from 'react'
import Layout from '@shared/components/Layout'
import { View } from 'react-native'
import Notification from '@shared/components/Notification'
import { createStackNavigator } from '@react-navigation/stack'

const Notifications = (props) => {
    const Stack = createStackNavigator()
    return (
        <Layout navigation={props.navigation}>
            <View>
                <Notification navigation={props.navigation} stack={Stack}/>
            </View>
        </Layout>
    )
}

export default Notifications