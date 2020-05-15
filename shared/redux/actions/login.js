import { DEAUTHENTICATE, AUTHENTICATE, SET_PRIMARY_FORM, DATA_TYPES, SET_USER } from '../types';
import { AsyncStorage } from 'react-native'
import agent from '../../utils/agent'
import isEqual from '../../utils/isEqual'

// gets token from the api and stores it in the redux store and in cookie
const onAuthenticate = (body) => {
    return async (dispatch) => {
        let response = await agent.http.LOGIN.makeLogin(body)
        if (response && response.status === 200) {
            if (process.env['APP'] === 'web') {
                window.localStorage.setItem('token', response.data.access_token)
                window.localStorage.setItem('refreshToken', response.data.refresh_token)
            } else {
                await AsyncStorage.setItem('token', response.data.access_token)
                await AsyncStorage.setItem('refreshToken', response.data.refresh_token)
            }
            dispatch({ type: AUTHENTICATE, payload: response.data });
        }
        return response
    };
};

const onDeauthenticate = () => {
    return async (dispatch) => {
        if (process.env['APP'] === 'web') {
            window.localStorage.setItem('refreshToken', '')
            window.localStorage.setItem('token', '')
        } else {
            await AsyncStorage.setItem('refreshToken', '')
            await AsyncStorage.setItem('token', '')
        }
        dispatch({ type: DEAUTHENTICATE, payload: {} })
        return
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
    }
}

export default {
    onUpdateUser,
    onUpdatePrimaryForm,
    onAuthenticate,
    onDeauthenticate,
    getDataTypes
};