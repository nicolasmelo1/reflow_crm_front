import React from 'react'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import axios from 'axios'
import { View, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import NotificationRecieved from './NotificationRecieved'
import { NotificationButton, NotificationTitle } from '../../styles/Notification'
import NotificationsConfiguration from './NotificationsConfiguration'
import { strings } from '../../utils/constants'

class Notification extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
        this.state = {
            isEditing: false
        }
    }

    setIsEditing = (data) => {
        this.setState(state => state.isEditing = data)
    }

    componentDidMount = () => {
        // we use the source so we can cancel requests if the component is unmounted
        this.source = this.CancelToken.source()
        this.props.onGetNotifications(this.source, {})
        this.props.onGetForms(this.source)
    }

    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        const Stack = this.props.stack

        return ( 
            <View>
                {this.state.isEditing ? (
                    <NotificationsConfiguration
                    formularies={this.props.formularies}
                    notificationConfiguration={this.props.notificationConfiguration}
                    cancelToken={this.CancelToken}
                    setIsEditing={this.setIsEditing}
                    onGetNotificationConfigurationFields={this.props.onGetNotificationConfigurationFields}
                    onGetNotificationConfiguration={this.props.onGetNotificationConfiguration}
                    onUpdateNotificationConfigurationState={this.props.onUpdateNotificationConfigurationState}
                    onUpdateNotificationConfiguration={this.props.onUpdateNotificationConfiguration}
                    onCreateNotificationConfiguration={this.props.onCreateNotificationConfiguration}
                    />
                ) : (
                    <View>
                        <View style={{ flexDirection: 'row',  borderBottomWidth: 1, borderBottomColor: '#f2f2f2', padding: 5}}>
                            <NotificationTitle>{strings['pt-br']['notificationRecievedTitleLabel']}</NotificationTitle>
                            <NotificationButton onPress={e=> {this.setIsEditing(true)}}>
                                <FontAwesomeIcon size={ 24 } icon={'cog'} style={{ color: '#17242D'}}/>
                            </NotificationButton>
                        </View>
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
                    formularies={this.props.formularies}
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
                        <NotificationButton onClick={e=> {this.setIsEditing(true)}}>
                            {strings['pt-br']['notificationButtonToConfigurationLabel']}
                        </NotificationButton>
                        <NotificationRecieved
                        onReadNotifications={this.props.onReadNotifications}
                        onGetNotifications={this.props.onGetNotifications}
                        cancelToken={this.CancelToken}
                        notification={this.props.notification}
                        dateFormat={this.props.dateFormat}
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
    dateFormat: state.login.dateFormat 
}), actions)(Notification)