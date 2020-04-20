import { DEAUTHENTICATE, AUTHENTICATE, ERROR, DATA_TYPES, SET_USER } from '../types';
import { AsyncStorage } from 'react-native'
import agent from '../agent'

// gets token from the api and stores it in the redux store and in cookie
const onAuthenticate = (body) => {
    return async (dispatch) => {
        let response = await agent.LOGIN.makeLogin(body)
        if (response.status === 200) {
            if (typeof window !== 'undefined' && process.env['APP'] === 'web') {
                window.localStorage.setItem('token', response.data.access_token)
                window.localStorage.setItem('refreshToken', response.data.refresh_token)
            } else {
                AsyncStorage.setItem('token', response.data.access_token)
                AsyncStorage.setItem('refreshToken', response.data.refresh_token)
            }
            dispatch({ type: AUTHENTICATE, payload: response.data });
        }
        return response
    };
};

const onDeauthenticate = () => {
    return (dispatch) => {
        dispatch({ type: DEAUTHENTICATE, payload: {} });
    }
}

const onUpdateUser = (user) => {
    return (dispatch) => {
        dispatch({ type: SET_USER, payload: user})
    }
}

const getDataTypes = () => {
    return async (dispatch, getState) => {
        //if (window.localStorage.getItem('refreshToken') !== '' && window.localStorage.getItem('token') !== '') {
        const stateData = getState().login
        try { 
            let response = await agent.LOGIN.getDataTypes()
            if (JSON.stringify(stateData.types) !== JSON.stringify(response.data.data)) {
                dispatch({ type: DATA_TYPES, payload: response.data.data });
            }
        } catch {}
    }
}

export default {
    onUpdateUser,
    onAuthenticate,
    onDeauthenticate,
    getDataTypes
};