import { SET_NOTIFY } from '../types';
import agent from '../agent'

/**
 * This is used for adding notification toasts to the top of the page
 * 
 * @param {String} message - The message you want to display on the notification toast
 * @param {String} Variant - right now we only accept `error` or `success` variants
 */
const onAddNotification = (message, variant) => {
    return (dispatch, getState) => {
        let stateData = getState().notify.notification
        stateData.push({ message: message, variant: variant})
        dispatch({ type: SET_NOTIFY, payload: stateData })
    }
}

const onRemoveNotification = () => {
    return (dispatch, getState) => {
        let stateData = getState().notify.notification
        stateData.splice(0, 1)
        dispatch({ type: SET_NOTIFY, payload: stateData })
    }
}

export default {
    onAddNotification,
    onRemoveNotification,
}