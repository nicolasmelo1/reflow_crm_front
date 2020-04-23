import React from 'react'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import axios from 'axios'
import NotificationRecieved from './NotificationRecieved'


class Notification extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
    }

    componentDidMount = () => {
        this.source = this.CancelToken.source()
        this.props.onGetNotifications(this.source, {})
    }

    componentWillUnmount = () => {
        this.source.cancel()
    }

    renderWeb = () => {
        return (
            <div>
                <NotificationRecieved
                onGetNotifications={this.props.onGetNotifications}
                cancelToken={this.CancelToken}
                pagination={this.props.notificationsPagination}
                notifications={this.props.notifications}
                dateFormat={this.props.dateFormat}
                />
            </div>
        )
    }

    renderMobile = () => {
        return ( null )
    }

    render() {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ 
    notifications: state.notification.notification.data.data, 
    notificationsPagination: state.notification.notification.data.pagination, 
    dateFormat: state.login.dateFormat 
}), actions)(Notification)