import { DEAUTHENTICATE, AUTHENTICATE, SET_PRIMARY_FORM, DATA_TYPES, SET_USER } from '../types'
import agent from '../../utils/agent'
import { getToken, setStorageToken } from '../../utils/agent/utils'

// gets token from the api and stores it in the redux store and in cookie
const onAuthenticate = (body) => {
    return async (dispatch) => {
        let response = await agent.http.LOGIN.makeLogin(body)
        if (response && response.status === 200) {
            await setStorageToken(response.data.access_token, response.data.refresh_token)
            dispatch({ type: AUTHENTICATE, payload: response.data });
        }
        return response
    }
}

const onDeauthenticate = () => {
    return async (dispatch) => {
        await setStorageToken('', '')
        dispatch({ type: DEAUTHENTICATE, payload: {} })
        return
    }
}

const onForgotPassword = (email, changePasswordUrl) => {
    return (_) => {
        return agent.http.LOGIN.forgotPassword({email: email, change_password_url: changePasswordUrl})
    }
}

const onUpdateUser = (user) => {
    return (dispatch) => {
        agent.http.USERS.updateVisualizationType(user.data_type)
        dispatch({ type: SET_USER, payload: user})
    }
}

const onUpdatePrimaryForm = (formName) => {
    return (dispatch) => {
        dispatch({ type: SET_PRIMARY_FORM, payload: formName})
    }
}

const getDataTypes = () => {
    return async (dispatch, getState) => {
        const token = await getToken()
        const stateData = getState().login
        const response = await agent.http.LOGIN.getDataTypes()
        const isLoggedIn = !['', null, undefined].includes(token)
        if (response && response.status === 200) {
            const isLastTypesDifferentFromNewTypes = JSON.stringify(response.data.data) !== JSON.stringify(stateData.types)
            if (!isLoggedIn || (isLoggedIn && isLastTypesDifferentFromNewTypes)) {
                dispatch({ type: DATA_TYPES, payload: response.data.data })
            }
        }
        return response
    }
}

export default {
    onForgotPassword,
    onUpdateUser,
    onUpdatePrimaryForm,
    onAuthenticate,
    onDeauthenticate,
    getDataTypes
};