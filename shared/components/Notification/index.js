import React from 'react'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import axios from 'axios'
import NotificationRecieved from './NotificationRecieved'
import { View, Text } from 'react-native'
import { NotificationButton } from '../../styles/Notification'
import NotificationsConfiguration from './NotificationsConfiguration'


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
        return ( 
            <View>
                {this.state.isEditing ? (
                    <NotificationsConfiguration
                    formularies={this.props.formularies}
                    notificationConfiguration={this.props.notificationConfiguration}
                    setIsEditing={this.setIsEditing}
                    cancelToken={this.CancelToken}
                    onGetNotificationConfigurationFields={this.props.onGetNotificationConfigurationFields}
                    onGetNotificationConfiguration={this.props.onGetNotificationConfiguration}
                    onUpdateNotificationConfigurationState={this.props.onUpdateNotificationConfigurationState}
                    />
                ) : (
                    <View>
                        <NotificationButton onPress={e=> {this.setIsEditing(true)}}>
                            <Text>Configurações</Text>
                        </NotificationButton>
                        <NotificationRecieved
                        navigation={this.props.navigation}
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
                    />
                ) : (
                    <div>
                        <NotificationButton onClick={e=> {this.setIsEditing(true)}}>
                            Configurações
                        </NotificationButton>
                        <NotificationRecieved
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