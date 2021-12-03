import React from 'react'
import actions from '../../redux/actions'
import axios from 'axios'
import { View, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import NotificationRecieved from './NotificationRecieved'
import NotificationsConfiguration from './NotificationsConfiguration'
import { strings } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'
import Styled from './styles'

const connect = dynamicImport('reduxConnect', 'default')

/**
 * This component is responsible for loading the notifications on the screen for the user.
 * 
 * Notifications in reflow are different from other companies, here it works more like a reminder that the user sets
 * with a custom text. 
 * 
 * Notifications are always bound to a specific formulary and a specific field. 
 * 
 * This component controls 2 things: The creation of these notifications and show the notifications generated to the user.
 * 
 * The props it recieves are only from redux actions and reducers.
 */
class Notification extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
        this.state = {
            isEditing: false
        }
    }

    setIsEditing = (data) => this.setState(state => state.isEditing = data)

    componentDidMount = () => {
        // we use the source so we can cancel requests if the component is unmounted
        this.source = this.CancelToken.source()
        this.props.onGetNotifications(this.source, {})
    }

    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        return ( 
            <View>
                {this.state.isEditing ? (
                    <NotificationsConfiguration
                    types={this.props.login.types}
                    user={this.props.login.user}
                    formularies={this.props.formularies}
                    onGetForms={this.props.onGetForms}
                    notificationConfiguration={this.props.notificationConfiguration}
                    cancelToken={this.CancelToken}
                    setIsEditing={this.setIsEditing}
                    onGetNotificationConfigurationFields={this.props.onGetNotificationConfigurationFields}
                    onGetNotificationConfiguration={this.props.onGetNotificationConfiguration}
                    onUpdateNotificationConfigurationState={this.props.onUpdateNotificationConfigurationState}
                    onUpdateNotificationConfiguration={this.props.onUpdateNotificationConfiguration}
                    onCreateNotificationConfiguration={this.props.onCreateNotificationConfiguration}
                    onRemoveNotificationConfiguration={this.props.onRemoveNotificationConfiguration}
                    />
                ) : (
                    <View>
                        <Styled.NotificationHeader>
                            <Styled.NotificationTitle>
                                {strings['pt-br']['notificationRecievedTitleLabel']}
                            </Styled.NotificationTitle>
                            <Styled.NotificationButton onPress={e=> {this.setIsEditing(true)}}>
                                <FontAwesomeIcon size={ 24 } icon={'cog'} style={{ color: '#20253F'}}/>
                            </Styled.NotificationButton>
                        </Styled.NotificationHeader>
                        <NotificationRecieved
                        navigation={this.props.navigation}
                        onReadNotifications={this.props.onReadNotifications}
                        onGetNotifications={this.props.onGetNotifications}
                        cancelToken={this.CancelToken}
                        notification={this.props.notification}
                        dateFormat={this.props.dateFormat}
                        />
                    </View>
                )}
            </View>
        )
    }

    renderWeb = () => {
        return (
            <div>
                {this.state.isEditing ? (
                    <NotificationsConfiguration
                    types={this.props.login.types}
                    user={this.props.login.user}
                    formularies={this.props.formularies}
                    onGetForms={this.props.onGetForms}
                    notificationConfiguration={this.props.notificationConfiguration}
                    cancelToken={this.CancelToken}
                    setIsEditing={this.setIsEditing}
                    onGetNotificationConfigurationFields={this.props.onGetNotificationConfigurationFields}
                    onGetNotificationConfiguration={this.props.onGetNotificationConfiguration}
                    onUpdateNotificationConfigurationState={this.props.onUpdateNotificationConfigurationState}
                    onUpdateNotificationConfiguration={this.props.onUpdateNotificationConfiguration}
                    onCreateNotificationConfiguration={this.props.onCreateNotificationConfiguration}
                    onRemoveNotificationConfiguration={this.props.onRemoveNotificationConfiguration}
                    />
                ) : (
                    <div>
                        <Styled.NotificationButton onClick={e=> {this.setIsEditing(true)}}>
                            {strings['pt-br']['notificationButtonToConfigurationLabel']}
                        </Styled.NotificationButton>
                        <NotificationRecieved
                        onReadNotifications={this.props.onReadNotifications}
                        onGetNotifications={this.props.onGetNotifications}
                        cancelToken={this.CancelToken}
                        notification={this.props.notification}
                        dateFormat={this.props.login.dateFormat}
                        />
                    </div>
                )}
            </div>
        )
    }

    render() {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ 
    formularies: state.home.sidebar.initial,
    notificationConfiguration: state.notification.notification.update,
    notification: state.notification.notification.data, 
    login: state.login 
}), actions)(Notification)