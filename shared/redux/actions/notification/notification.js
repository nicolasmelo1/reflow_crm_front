import { SET_NOTIFICATION, SET_NOTIFICATION_CONFIGURATION, SET_NOTIFICATION_BADGE } from '../../types'
import agent from '../../agent'


const onGetNotifications = (source, params = { page: 1 }) => {
    return async (dispatch, getState) => {
        const response = await agent.NOTIFICATION.getNotification(source, params)
        if (response && response.status === 200) {
            let notificationsData = getState().notification.notification.data.data
            const payload = {
                pagination: {
                    current: response.data.pagination.current,
                    total: response.data.pagination.total
                },
                data: params.page > 1 ? notificationsData.concat(response.data.data) : response.data.data
            }
            dispatch({ type: SET_NOTIFICATION, payload: payload })
        }
        return response
    }
}

const onReadNotifications = (stateData, notificationId) => {
    return (dispatch, getState) => {
        const payload = {
            ...getState().notification.notification.data,
            data: stateData
        }
        const body = {
            notification_id: notificationId
        }
        agent.NOTIFICATION.readNotification(body)
        dispatch({ type: SET_NOTIFICATION, payload: payload })
    }
}

const onGetNewNotifications = () => {
    return async (dispatch) => {
        const response = await agent.NOTIFICATION.getNewNotifications()
        if (response && response.status === 200) {
            dispatch({ type: SET_NOTIFICATION_BADGE, payload: response.data.data })

        } 
    }
}

const onGetNotificationConfiguration = (source, params = {}) => {
    return async (dispatch) => {
        const response = await agent.NOTIFICATION.getNotificationConfiguration(source, params)
        if (response && response.status === 200) {
            dispatch({ type: SET_NOTIFICATION_CONFIGURATION, payload: response.data.data })
        }
    }
}

const onUpdateNotificationConfigurationState = (data) => {
    return (dispatch) => {
        dispatch({ type: SET_NOTIFICATION_CONFIGURATION, payload: data })
    }
}

const onUpdateNotificationConfiguration = (body, notificationConfigurationId) => {
    return (_) => {
        return agent.NOTIFICATION.updateNotificationConfiguration(body, notificationConfigurationId)
    }
}

const onCreateNotificationConfiguration = (body) => {
    return (_) => {
        return agent.NOTIFICATION.createNotificationConfiguration(body)
    }
}

const onRemoveNotificationConfiguration = (notificationConfigurationId) => {
    return (_) => {
        return agent.NOTIFICATION.removeNotificationConfiguration(notificationConfigurationId)
    }
}

const onGetNotificationConfigurationFields = (source, formId) => {
    return (_) => {
        return agent.NOTIFICATION.getNotificationConfigurationFields(source, formId)
    }
}

export default {
    onGetNewNotifications,
    onGetNotifications,
    onReadNotifications,
    onGetNotificationConfiguration,
    onGetNotificationConfigurationFields,
    onUpdateNotificationConfigurationState,
    onUpdateNotificationConfiguration,
    onCreateNotificationConfiguration,
    onRemoveNotificationConfiguration
}