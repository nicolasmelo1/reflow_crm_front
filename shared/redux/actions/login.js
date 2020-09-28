import { DEAUTHENTICATE, AUTHENTICATE, SET_PRIMARY_FORM, DATA_TYPES, SET_USER } from '../types'
import agent from '../../utils/agent'
import { setStorageToken } from '../../utils/agent/utils'
import isEqual from '../../utils/isEqual'
import initializeConpass from '../../utils/conpass'

// gets token from the api and stores it in the redux store and in cookie
const onAuthenticate = (body) => {
    return async (dispatch) => {
        let response = await agent.http.LOGIN.makeLogin(body)
        if (response && response.status === 200) {
            await setStorageToken(response.data.access_token, response.data.refresh_token)
            initializeConpass(
                `${response.data.first_name} ${response.data.last_name}`, 
                response.data.user.email, {
                    id: response.data.user.id,
                    is_superuser: response.data.user.is_superuser,
                    company: response.data.user.company,
                    profile: response.data.user.profile
                })
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
        const stateData = getState().login
        const response = await agent.http.LOGIN.getDataTypes()
        if (response && response.status === 200 && !isEqual(response.data.data, stateData.types)) {
            dispatch({ type: DATA_TYPES, payload: response.data.data })
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