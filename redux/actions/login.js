import Router from 'next/router';
import axios from 'axios';
import { DEAUTHENTICATE, AUTHENTICATE, ERROR } from '../types';
import { API } from '../../config';
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

export default {
    onAuthenticate,
    onDeauthenticate
};