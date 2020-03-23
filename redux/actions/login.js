import { DEAUTHENTICATE, AUTHENTICATE, ERROR, DATA_TYPES } from '../types';
import agent from '../agent'

// gets token from the api and stores it in the redux store and in cookie
const onAuthenticate = (body) => {
    return async (dispatch) => {
        let response = await agent.LOGIN.makeLogin(body)
        dispatch({ type: (response.status === 200) ? AUTHENTICATE : ERROR, payload: response.data });
    };
};

const onDeauthenticate = () => {
    return (dispatch) => {
        dispatch({ type: DEAUTHENTICATE, payload: {} });
    }
}

const getDataTypes = () => {
    return async (dispatch, getState) => {
        if (window.localStorage.getItem('refreshToken') !== '' && window.localStorage.getItem('token') !== '') {
            const stateData = getState().login
            let response = await agent.LOGIN.getDataTypes()
            if (JSON.stringify(stateData.types) !== JSON.stringify(response.data.data)) {
                dispatch({ type: DATA_TYPES, payload: response.data.data });
            }
        }
    }
}

export default {
    onAuthenticate,
    onDeauthenticate,
    getDataTypes
};