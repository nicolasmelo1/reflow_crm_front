import React, { useState,useEffect } from 'react'
import { Animated, View, ScrollView, Text, Dimensions } from 'react-native'
import { NotificationConfigurationAddNewCardIcon, NotificationConfigurationAddNewCard, NotificationConfigurationAddNewCardText, NotificationConfigurationGoBackButton } from '../../styles/Notification'
import NotificationConfiguration from './NotificationConfiguration'
import { strings } from '../../utils/constants'

const Screen = (props) => {
    const [widthAnim] = useState(new Animated.Value(Dimensions.get('window').width))

    React.useEffect(() => {
      Animated.timing(widthAnim, {
        toValue: 0,
        duration: 300,
      }).start()
    }, [])
  
    return (
      <Animated.View // Special animatable View
        style={{
            ...props.style,
            transform: [{
                translateX: widthAnim
            }], // Bind opacity to animated value
        }}>
        {props.children}
      </Animated.View>
    )
}


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
            <Screen>
                <View style={{ justifyContent: 'column', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#f2f2f2'}}>
                    <NotificationConfigurationGoBackButton onPress={e=> {props.setIsEditing(false)}} title={strings['pt-br']['notificationConfigurationGoBackButtonLabel']} color={'#17242D'}/>
                </View>
                <ScrollView keyboardShouldPersistTaps={'handled'} style={{ height: '100%'}}>
                    <NotificationConfigurationAddNewCard onPress={e=> {addNewNotification()}}>
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
            </Screen>
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
