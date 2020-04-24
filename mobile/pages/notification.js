import React from 'react'
import Layout from '@shared/components/Layout'
import { View } from 'react-native'
import Notification from '@shared/components/Notification'

const Notifications = (props) => {
    return (
        <Layout>
            <View style={{ padding: 5 }}>
                <Notification navigation={props.navigation}/>
            </View>
        </Layout>
    )
}

export default Notifications