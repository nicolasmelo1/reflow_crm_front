import React, { useEffect } from 'react'
import { ScrollView, Modal } from 'react-native'
import NotificationConfiguration from './NotificationConfiguration'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { strings } from '../../utils/constants'
import Styled from './styles'

/**
 * This component holds most of the logins for notification configurations and actually stores all of the Notification Configuration cards.
 * 
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff 
 * @param {Object} user - The user object so we can render specific stuff for admins.
 * @param {Array<Object>} formularies - These are the formularies loaded from the sidebar, 
 * @param {Array<Object>} notificationConfiguration - The redux state
 * @param {Object} notificationConfiguration - basically the 'update' part of the notification reducer. See `redux/reducers/notification/notification` for reference.
 * @param {Object} cancelToken - A axios cancel token. We use this so we can cancel a request and the promise when the user unmounts a component,
 * before the data is retrieved
 * @param {Function} setIsEditing - Function responsible for changing `isEditing` stage in the parent component. This state is responsible to mount and unmount
 * this component
 * @param {Function} onGetNotificationConfigurationFields - Redux action used for retrieving the fields the user can select as variables and the 
 * `date` field_type fields of the form
 * @param {Function} onGetNotificationConfiguration - Redux action used for retriving the notification configuration data.
 * @param {Function} onUpdateNotificationConfigurationState - Redux action responsible for updating the notification configuration array state, IT DOES NOT DO
 * any external API call in any sort.
 * @param {Function} onUpdateNotificationConfiguration - Redux action responsible for updating the notification configuration on the Backend, so this action
 * actually does an API call to the backend to update the notification.
 * @param {Function} onCreateNotificationConfiguration - Redux action responsible for creating, so pushing, the notification configuration data to the backend
 * this does not change the state in any sort.
 * @param {Function} onRemoveNotificationConfiguration - Redux action responsible for removing the notification configuration data on the backend, this does not update
 * the state in any sort.
 */
const NotificationsConfiguration = (props) => {
    const sourceRef = React.useRef()

    /**
     * This function does a deep copy of the data before sending it to redux, so we can force the new
     * state update. 
     * 
     * @param {BigInteger} index - The index of the card that was updated, so we update correclty on the notificationConfigurationData array.
     * @param {Object} data - This is the data of the notification, the format of this data can be seen on redux or on `addNewNotification`
     * function
     */
    const updateNotification = (index, data) => {
        let notificationsData = JSON.parse(JSON.stringify(props.notificationConfiguration.data))
        notificationsData[index] = data
        props.onUpdateNotificationConfigurationState(notificationsData)
    }

    /**
     * This is handy function to add new notifications, when the user clicks 'add new notification' button
     * we appends the object ON THE FIRST INDEX of the array. (we don't append on the last index, because on long
     * lists, the user might not even see the new notification he added)
     */
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

    /**
     * This function is used to remove a certain index from the array of `notificationConfiguration`s
     * If the `id` attribute of the element in the index specified is not null, we remove it in the database
     * and then after that we remove from the list and update the state from redux.
     * 
     * Obviously that if `id` is null on this specific index then we don't send nothing to the backend.
     * 
     * @param {BigInteger} index - The index of the element you want to remove in the `props.notificationConfiguration.data` array
     */
    const removeNotification = (index) => {
        if (props.notificationConfiguration.data[index] && props.notificationConfiguration.data[index].id) {
            props.onRemoveNotificationConfiguration(props.notificationConfiguration.data[index].id)
        }
        props.notificationConfiguration.data.splice(index, 1)
        props.onUpdateNotificationConfigurationState(props.notificationConfiguration.data)
    }

    /**
     * Function used for saving the notification configuration data. Based on a the `id` attribute of the 
     * object we can know if we need to update or create a new object so if it's a PUT or a POST request.
     * 
     * @param {Object} body - The notification configuration data, see `addNewNotification` function to know how the
     * structure of the object should be to submit.
     */
    const createOrUpdateNotification = (body) => {
        if (body.id) {
            return props.onUpdateNotificationConfiguration(body, body.id)
        } else {
            return props.onCreateNotificationConfiguration(body)
        }
    }

    useEffect(() => {
        // When we mount this component we get all of the notificationConfiguration data as an array.
        // Also we get the formularies that we can use as option so we can use on the NotificationConfigurationForm
        sourceRef.current = props.cancelToken.source()
        props.onGetNotificationConfiguration(sourceRef.current)
        props.onGetForms(sourceRef.current)
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
                <Styled.NotificationConfigurationContainer>
                    <Styled.NotificationHeader isEditing={true}>
                        <Styled.NotificationConfigurationGoBackButton onPress={e=> {props.setIsEditing(false)}}>
                            <FontAwesomeIcon icon={'times'}/>
                        </Styled.NotificationConfigurationGoBackButton>
                    </Styled.NotificationHeader>
                    <ScrollView keyboardShouldPersistTaps={'handled'} style={{ height: '93.5%'}}>
                        <Styled.NotificationConfigurationAddNewCard onPress={e=> {addNewNotification()}}>
                            <Styled.NotificationConfigurationAddNewCardIcon icon="plus-circle"/>
                            <Styled.NotificationConfigurationAddNewCardText>
                                {strings['pt-br']['notificationConfigurationAddNewCardLabel']}
                            </Styled.NotificationConfigurationAddNewCardText>
                        </Styled.NotificationConfigurationAddNewCard>
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
                </Styled.NotificationConfigurationContainer>
            </Modal>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <div>
                    <Styled.NotificationConfigurationGoBackButton onClick={e=> {props.setIsEditing(false)}}>
                        {strings['pt-br']['notificationConfigurationGoBackButtonLabel']}
                    </Styled.NotificationConfigurationGoBackButton>
                </div>
                <Styled.NotificationConfigurationContainer>
                    <Styled.NotificationConfigurationAddNewCard style={{ textAlign: 'center'}} onClick={e=> {addNewNotification()}}>
                        <Styled.NotificationConfigurationAddNewCardIcon icon="plus-circle"/>
                        <Styled.NotificationConfigurationAddNewCardText>
                            {strings['pt-br']['notificationConfigurationAddNewCardLabel']}
                        </Styled.NotificationConfigurationAddNewCardText>
                    </Styled.NotificationConfigurationAddNewCard>
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
                        />
                    ))}
                </Styled.NotificationConfigurationContainer>
            </div>
        )
    }
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default NotificationsConfiguration
