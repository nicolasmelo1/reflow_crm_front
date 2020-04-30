import React, { useState } from 'react'
import { TouchableWithoutFeedback, View, Keyboard } from 'react-native'
import { NotificationConfigurationCard, NotificationConfigurationCardText, NotificationConfigurationCardIcon } from '../../styles/Notification'
import NotificationConfigurationForm from  './NotificationConfigurationForm'
import { strings } from '../../utils/constants'

/**
 * Holds each notification configuration card and formulary
 * @param {*} props 
 */
const NotificationConfiguration = (props) => {
    const [formIsOpen, setFormIsOpen] = useState(false)

    const renderMobile = () => {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                    <NotificationConfigurationCard formIsOpen={formIsOpen} onPress={e=> {setFormIsOpen(!formIsOpen)}}>
                        <NotificationConfigurationCardText formIsOpen={formIsOpen} isNew={[null, ''].includes(props.notificationConfiguration.name)}>
                            {[null, ''].includes(props.notificationConfiguration.name) ? strings['pt-br']['notificationConfigurationEmptyNameCardLabel'] : props.notificationConfiguration.name}
                        </NotificationConfigurationCardText>
                        <NotificationConfigurationCardIcon icon="trash" onPress={e => {
                            e.stopPropagation()
                            props.removeNotification(props.notificationConfigurationIndex)
                        }}/>
                    </NotificationConfigurationCard>
                    {formIsOpen ? (
                        <NotificationConfigurationForm
                            formularies={props.formularies}
                            cancelToken={props.cancelToken}
                            setFormIsOpen={setFormIsOpen}
                            updateNotification={props.updateNotification}
                            createOrUpdateNotification={props.createOrUpdateNotification}
                            onGetNotificationConfigurationFields={props.onGetNotificationConfigurationFields}
                            notificationConfigurationFields={props.notificationConfigurationFields}
                            notificationConfigurationIndex={props.notificationConfigurationIndex}
                            notificationConfiguration={props.notificationConfiguration}
                        />
                    ) : null}
                </View>
            </TouchableWithoutFeedback>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <NotificationConfigurationCard formIsOpen={formIsOpen} onClick={e=> {setFormIsOpen(!formIsOpen)}}>
                    <NotificationConfigurationCardText formIsOpen={formIsOpen} isNew={[null, ''].includes(props.notificationConfiguration.name)}>
                        {[null, ''].includes(props.notificationConfiguration.name) ? strings['pt-br']['notificationConfigurationEmptyNameCardLabel'] : props.notificationConfiguration.name}
                        <NotificationConfigurationCardIcon icon="trash" onClick={e => {
                            e.stopPropagation()
                            props.removeNotification(props.notificationConfigurationIndex)
                        }}/>
                    </NotificationConfigurationCardText>
                </NotificationConfigurationCard>
                {formIsOpen ? (
                    <NotificationConfigurationForm
                        formularies={props.formularies}
                        cancelToken={props.cancelToken}
                        setFormIsOpen={setFormIsOpen}
                        updateNotification={props.updateNotification}
                        createOrUpdateNotification={props.createOrUpdateNotification}
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
