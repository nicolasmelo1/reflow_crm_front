import React, { useState } from 'react'
import { TouchableWithoutFeedback, TouchableOpacity , View, Keyboard } from 'react-native'
import NotificationConfigurationForm from  './NotificationConfigurationForm'
import Alert from '../Alert'
import { strings } from '../../utils/constants'
import { 
    NotificationConfigurationCard, 
    NotificationConfigurationCardText, 
    NotificationConfigurationCardIcon 
} from '../../styles/Notification'

/**
 * This component is responsible for holding each notification configuration card and formulary.
 * 
 * It's important to notice here that the formulary here is simmilar to formularies inside of the billing component.
 * What this means is that, the formulary opens BELOW the card, there's no modal or page that pops up to the user.
 * 
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff 
 * @param {Object} user - The user object so we can render specific stuff for admins.
 * @param {Array<Object>} formularies - These are the formularies loaded from the sidebar, 
 * if the sidebar hasn't been loaded, we load when we open the notification configuration component
 * @param {Object} cancelToken - A axios cancel token, we use this so we can cancel a request when a user unmounts a component before the data be retrieved
 * @param {Boolean} setFormIsOpen - The configuration is loaded right below the card, this is a state function that can be true or false, 
 * defining if this component is opened or not
 * @param {Function} updateNotification - Function to update the notification configuration state
 * @param {Function} createOrUpdateNotification - Function defined in NotificationsConfiguration component used for saving the notification configuration 
 * data. Based on a the `id` attribute of the object we can know if we need to update or create a new object so if it's a PUT or a POST request.
 * @param {Function} removeNotification - Function used to delete the notification configuration, if an id is defined, remove on the backend
 * if not just remove from the list
 * @param {Function} onGetNotificationConfigurationFields - Redux action used for retrieving the fields the user can select as variables and the 
 * `date` field_type fields of the form
 * @param {BigInteger} notificationConfigurationIndex - Index of this notification configuration, we use this to update the state at a specific index.
 * @param {Object} notificationConfiguration - The notification configuration data
 */
const NotificationConfiguration = (props) => {
    const [formIsOpen, setFormIsOpen] = useState(false)
    const [formularyIndexToRemove, setFormularyIndexToRemove] = useState(null)
    const [showAlert, setShowAlert] = useState(false)
    
    const renderMobile = () => {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                    <Alert 
                    alertTitle={strings['pt-br']['notificationConfigurationRemoveAlertTitle']} 
                    alertMessage={strings['pt-br']['notificationConfigurationRemoveAlertContent']} 
                    show={showAlert} 
                    onHide={() => {
                        setFormularyIndexToRemove(null)
                        setShowAlert(false)
                    }} 
                    onAccept={() => {
                        setShowAlert(false)
                        props.removeNotification(formularyIndexToRemove)
                    }}
                    onAcceptButtonLabel={strings['pt-br']['notificationConfigurationRemoveAlertAcceptButtonLabel']}
                    />
                    <NotificationConfigurationCard formIsOpen={formIsOpen} onPress={e=> {setFormIsOpen(!formIsOpen)}}>
                        <NotificationConfigurationCardText formIsOpen={formIsOpen} isNew={[null, ''].includes(props.notificationConfiguration.name)}>
                            {[null, ''].includes(props.notificationConfiguration.name) ? strings['pt-br']['notificationConfigurationEmptyNameCardLabel'] : props.notificationConfiguration.name}
                        </NotificationConfigurationCardText>
                        <TouchableOpacity style={{ height: 40, width: 40, alignItems: 'center', justifyContent:'center'}} onPress={e => {
                            e.stopPropagation()
                            setFormularyIndexToRemove(props.notificationConfigurationIndex)
                            setShowAlert(true)
                        }}>
                            <NotificationConfigurationCardIcon icon="trash"/>
                        </TouchableOpacity>
                    </NotificationConfigurationCard>
                    {formIsOpen ? (
                        <NotificationConfigurationForm
                            types={props.types}
                            user={props.user}
                            formularies={props.formularies}
                            cancelToken={props.cancelToken}
                            setFormIsOpen={setFormIsOpen}
                            updateNotification={props.updateNotification}
                            createOrUpdateNotification={props.createOrUpdateNotification}
                            onGetNotificationConfigurationFields={props.onGetNotificationConfigurationFields}
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
                <Alert 
                alertTitle={strings['pt-br']['notificationConfigurationRemoveAlertTitle']} 
                alertMessage={strings['pt-br']['notificationConfigurationRemoveAlertContent']} 
                show={showAlert} 
                onHide={() => {
                    setFormularyIndexToRemove(null)
                    setShowAlert(false)
                }} 
                onAccept={() => {
                    setShowAlert(false)
                    props.removeNotification(formularyIndexToRemove)
                }}
                onAcceptButtonLabel={strings['pt-br']['notificationConfigurationRemoveAlertAcceptButtonLabel']}
                />
                <NotificationConfigurationCard formIsOpen={formIsOpen} onClick={e=> {setFormIsOpen(!formIsOpen)}}>
                    <NotificationConfigurationCardText formIsOpen={formIsOpen} isNew={[null, ''].includes(props.notificationConfiguration.name)}>
                        {[null, ''].includes(props.notificationConfiguration.name) ? strings['pt-br']['notificationConfigurationEmptyNameCardLabel'] : props.notificationConfiguration.name}
                        <NotificationConfigurationCardIcon icon="trash" onClick={e => {
                            e.stopPropagation()
                            setFormularyIndexToRemove(props.notificationConfigurationIndex)
                            setShowAlert(true)
                        }}/>
                    </NotificationConfigurationCardText>
                </NotificationConfigurationCard>
                {formIsOpen ? (
                    <NotificationConfigurationForm
                        types={props.types}
                        user={props.user}
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
