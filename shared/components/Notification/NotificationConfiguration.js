import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { NotificationConfigurationCard, NotificationConfigurationCardText } from '../../styles/Notification'
import NotificationConfigurationForm from  './NotificationConfigurationForm'

const NotificationConfiguration = (props) => {
    const [formIsOpen, setFormIsOpen] = useState(false)

    const renderMobile = () => {
        return (
            <View>
                <NotificationConfigurationCard formIsOpen={formIsOpen} onPress={e=> {setFormIsOpen(!formIsOpen)}}>
                    <NotificationConfigurationCardText formIsOpen={formIsOpen}>
                        {props.notificationConfiguration.name}
                    </NotificationConfigurationCardText>
                </NotificationConfigurationCard>
                {formIsOpen ? (
                    <NotificationConfigurationForm
                        formularies={props.formularies}
                        cancelToken={props.cancelToken}
                        updateNotification={props.updateNotification}
                        onGetNotificationConfigurationFields={props.onGetNotificationConfigurationFields}
                        notificationConfigurationFields={props.notificationConfigurationFields}
                        notificationConfigurationIndex={props.notificationConfigurationIndex}
                        notificationConfiguration={props.notificationConfiguration}
                    />
                ) : null}
            </View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <NotificationConfigurationCard formIsOpen={formIsOpen} onClick={e=> {setFormIsOpen(!formIsOpen)}}>
                    <NotificationConfigurationCardText formIsOpen={formIsOpen}>
                        {props.notificationConfiguration.name}
                    </NotificationConfigurationCardText>
                </NotificationConfigurationCard>
                {formIsOpen ? (
                    <NotificationConfigurationForm
                        formularies={props.formularies}
                        cancelToken={props.cancelToken}
                        updateNotification={props.updateNotification}
                        onGetNotificationConfigurationFields={props.onGetNotificationConfigurationFields}
                        notificationConfigurationFields={props.notificationConfigurationFields}
                        notificationConfigurationIndex={props.notificationConfigurationIndex}
                        notificationConfiguration={props.notificationConfiguration}
                    />
                ) : ''}
            </div>
        )
    }
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default NotificationConfiguration
