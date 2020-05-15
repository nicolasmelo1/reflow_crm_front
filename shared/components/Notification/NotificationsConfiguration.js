import React, { useEffect } from 'react'
import { ScrollView, Modal } from 'react-native'
import { NotificationConfigurationContainer, NotificationHeader, NotificationConfigurationAddNewCardIcon, NotificationConfigurationAddNewCard, NotificationConfigurationAddNewCardText, NotificationConfigurationGoBackButton } from '../../styles/Notification'
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
            <Modal
            animationType="slide"
            >
                <NotificationConfigurationContainer>
                    <NotificationHeader>
                        <NotificationConfigurationGoBackButton onPress={e=> {props.setIsEditing(false)}} title={'x'} color={'#17242D'}/>
                    </NotificationHeader>
                    <ScrollView keyboardShouldPersistTaps={'handled'} style={{ height: '93.5%'}}>
                        <NotificationConfigurationAddNewCard onPress={e=> {addNewNotification()}}>
                            <NotificationConfigurationAddNewCardIcon icon="plus-circle"/>
                            <NotificationConfigurationAddNewCardText>
                                {strings['pt-br']['notificationConfigurationAddNewCardLabel']}
                            </NotificationConfigurationAddNewCardText>
                        </NotificationConfigurationAddNewCard>
                        {props.notificationConfiguration.data.map((notificationConfiguration, index) => (
                            <NotificationConfiguration
                            key={index}
                            types={props.types}
                            user={props.user}
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
                </NotificationConfigurationContainer>
            </Modal>
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
                <NotificationConfigurationContainer>
                    <NotificationConfigurationAddNewCard style={{ textAlign: 'center'}} onClick={e=> {addNewNotification()}}>
                        <NotificationConfigurationAddNewCardIcon icon="plus-circle"/>
                        <NotificationConfigurationAddNewCardText>
                            {strings['pt-br']['notificationConfigurationAddNewCardLabel']}
                        </NotificationConfigurationAddNewCardText>
                    </NotificationConfigurationAddNewCard>
                    {props.notificationConfiguration.data.map((notificationConfiguration, index) => (
                        <NotificationConfiguration
                        key={index}
                        types={props.types}
                        user={props.user}
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
                </NotificationConfigurationContainer>
            </div>
        )
    }
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default NotificationsConfiguration
