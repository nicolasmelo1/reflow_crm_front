import React, { useEffect } from 'react'
import { View, ScrollView, Button } from 'react-native'
import { NotificationConfigurationAddNewCardIcon, NotificationConfigurationAddNewCard, NotificationConfigurationAddNewCardText, NotificationConfigurationGoBackButton } from '../../styles/Notification'
import NotificationConfiguration from './NotificationConfiguration'
import { strings } from '../../utils/constants'

const NotificationsConfiguration = (props) => {
    const sourceRef = React.useRef()

    const updateNotification = (index, data) => {
        let notificationsData = JSON.parse(JSON.stringify(props.notificationConfiguration.data))
        notificationsData[index] = data
        props.onUpdateNotificationConfigurationState(notificationsData)
    }

    const addNewNotification = () => {
        const data = {
            id: null,
            for_company: false,
            name: '',
            text: '',
            days_diff: '0',
            form: null,
            field: null,
            notification_configuration_variables: []
        }
        let notificationsData = JSON.parse(JSON.stringify(props.notificationConfiguration.data))
        notificationsData.splice(0, 0, data)
        props.onUpdateNotificationConfigurationState(notificationsData)
    }

    const removeNotification = (index) => {
        let notificationsData = JSON.parse(JSON.stringify(props.notificationConfiguration.data))
        if (notificationsData[index] && notificationsData[index].id) {
            props.onRemoveNotificationConfiguration(notificationsData[index].id)
        }
        notificationsData.splice(index, 1)
        props.onUpdateNotificationConfigurationState(notificationsData)
    }

    const createOrUpdateNotification = (body) => {
        if (body.id) {
            return props.onUpdateNotificationConfiguration(body, body.id)
        } else {
            props.onCreateNotificationConfiguration(data)
        }
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
            <View style={{ height: '100%' }}>
                <View style={{ justifyContent: 'row', alignItems: 'flex-start'}}>
                    <NotificationConfigurationGoBackButton onPress={e=> {props.setIsEditing(false)}} title={strings['pt-br']['notificationConfigurationGoBackButtonLabel']} color={'#17242D'}/>
                </View>
                <ScrollView keyboardShouldPersistTaps={'handled'} style={{ height: '100%' }}>
                    <NotificationConfigurationAddNewCard style={{ textAlign: 'center'}} onPress={e=> {addNewNotification()}}>
                        <NotificationConfigurationAddNewCardIcon icon="plus-circle"/>
                        <NotificationConfigurationAddNewCardText>
                            {strings['pt-br']['notificationConfigurationAddNewCardLabel']}
                        </NotificationConfigurationAddNewCardText>
                    </NotificationConfigurationAddNewCard>
                    {props.notificationConfiguration.data.map((notificationConfiguration, index) => (
                        <NotificationConfiguration
                        key={index}
                        formularies={props.formularies}
                        onGetNotificationConfigurationFields={props.onGetNotificationConfigurationFields}
                        updateNotification={updateNotification}
                        removeNotification={removeNotification}
                        createOrUpdateNotification={createOrUpdateNotification}
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
                <div>
                    <NotificationConfigurationGoBackButton onClick={e=> {props.setIsEditing(false)}}>
                        {strings['pt-br']['notificationConfigurationGoBackButtonLabel']}
                    </NotificationConfigurationGoBackButton>
                </div>
                <div>
                    <NotificationConfigurationAddNewCard style={{ textAlign: 'center'}} onClick={e=> {addNewNotification()}}>
                        <NotificationConfigurationAddNewCardIcon icon="plus-circle"/>
                        <NotificationConfigurationAddNewCardText>
                            {strings['pt-br']['notificationConfigurationAddNewCardLabel']}
                        </NotificationConfigurationAddNewCardText>
                    </NotificationConfigurationAddNewCard>
                    {props.notificationConfiguration.data.map((notificationConfiguration, index) => (
                        <NotificationConfiguration
                        key={index}
                        formularies={props.formularies}
                        onGetNotificationConfigurationFields={props.onGetNotificationConfigurationFields}
                        updateNotification={updateNotification}
                        removeNotification={removeNotification}
                        createOrUpdateNotification={createOrUpdateNotification}
                        cancelToken={props.cancelToken}
                        notificationConfigurationIndex={index}
                        notificationConfiguration={notificationConfiguration}
                        notificationConfigurationFields={props.notificationConfiguration.fields}
                        />
                    ))}
                </div>
            </div>
        )
    }
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default NotificationsConfiguration
