import { SET_NOTIFICATION } from '../../types'
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

export default {
    onGetNotifications
}