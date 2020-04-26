import React, { useEffect } from 'react'
import { View, ScrollView, Button } from 'react-native'
import NotificationConfiguration from './NotificationConfiguration'


const NotificationsConfiguration = (props) => {
    const sourceRef = React.useRef()

    const updateNotification = (index, data) => {
        let notificationsData = JSON.parse(JSON.stringify(props.notificationConfiguration.data))
        notificationsData[index] = data
        props.onUpdateNotificationConfigurationState(notificationsData)
    }


    useEffect(() => {
        sourceRef.current = props.cancelToken.source()
        props.onGetNotificationConfiguration(sourceRef.current)
        return () => {
            if(sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    const renderMobile = () => {
        return (
            <View>
                <Button onPress={e=> {props.setIsEditing(false)}} title={'< Voltar'}/>
                <ScrollView>
                    {props.notificationConfiguration.data.map((notificationConfiguration, index) => (
                        <NotificationConfiguration
                        key={index}
                        formularies={props.formularies}
                        onGetNotificationConfigurationFields={props.onGetNotificationConfigurationFields}
                        updateNotification={updateNotification}
                        cancelToken={props.cancelToken}
                        notificationConfigurationIndex={index}
                        notificationConfiguration={notificationConfiguration}
                        notificationConfigurationFields={props.notificationConfiguration.fields}
                        />
                    ))}
                </ScrollView>

            </View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                {props.notificationConfiguration.data.map((notificationConfiguration, index) => (
                    <NotificationConfiguration
                    key={index}
                    formularies={props.formularies}
                    onGetNotificationConfigurationFields={props.onGetNotificationConfigurationFields}
                    updateNotification={updateNotification}
                    cancelToken={props.cancelToken}
                    notificationConfigurationIndex={index}
                    notificationConfiguration={notificationConfiguration}
                    notificationConfigurationFields={props.notificationConfiguration.fields}
                    />
                ))}
            </div>
        )
    }
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default NotificationsConfiguration
