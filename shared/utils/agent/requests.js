import axios from 'axios'
import { getToken, setHeader, API_ROOT, logoutFunctionForView, setStorageToken, permissionsHandlerForView } from './utils'


/***
 * Function that fires when a exception is catched in the requests object functions.
 * This is only for retrieving a new token while firing a request. This way, the token is refreshed 
 * behind the scenes and doesn't affect the request at all.
 * Some nice update to it would be to create a Queue of requests, so this just fires once, the other
 * requests wait for the first one to finish before continuing.
 * 
 * @param response - the response of the axios exception
 * @param callback - the function to fire with the new token after it has been refreshed. Callbacks are any `requests` functions like: 'get', 'del', etc.
 * @param url - the url parameter from the function
 * @param params - the param or body parameter from the function
 * @param headers - the headers parameter from the function
 */
const refreshToken = async (response, callback, url, params, headers) => {
    if (response.data.reason === 'expired_token') {
        let refreshToken = ''
        if (process.env['APP'] === 'web') {
            refreshToken = window.localStorage.getItem('refreshToken') 
        } else {
            const AsyncStorage = require('react-native').AsyncStorage
            refreshToken = await AsyncStorage.getItem('refreshToken')
        }
        try {
            response = await axios.get(`${API_ROOT}authentication/refresh_token/`, {
                headers: setHeader(refreshToken)
            })
        // checks if the response was an error and handles it next
        } catch {
            await setStorageToken('', '')
            if (logoutFunctionForView) {
                logoutFunctionForView(true)
            }
        }
        await setStorageToken(response.data.access_token, response.data.refresh_token)
        return callback(url, params, headers)
    }
    if (['invalid_token', 'login_required'].includes(response.data.reason)) {
        await setStorageToken('', '')
        if (logoutFunctionForView) {
            logoutFunctionForView(true)
        }        
    } 
    return response
}

/**
 * This function is responsible for handling all of the exceptions of a request, if it is something about the login or about
 * jwt_token, we handle it here, otherwise we 
 * 
 * @param {Object} response - the response of the axios exception
 * @param {Function} callback - the function to fire with the new token after it has been refreshed. Callbacks are any `requests` functions like: 'get', 'del', etc.
 * @param {String} url - the url parameter from the function
 * @param {Object} params - the param or body parameter from the function
 * @param {Object} headers - the headers parameter from the function
 */
const exceptionHandler = async (response, callback, url, params, headers) => {
    if (response && response.data) {
        if (response.data.reason && ['invalid_token', 'login_required', 'expired_token'].includes(response.data.reason)) {
            return refreshToken(response, callback, url, params, headers)
        } else {
            if (permissionsHandlerForView) {
                permissionsHandlerForView(response.status, response.data.reason)
            }
        }
    }

    return response
}


/***
 * The main object functions for api requests to our backend, PLEASE use this instead of calling the apis directly.
 * It contains 4 main functions for the 4 main request methods: GET, POST, DELETE and PUT.
 * Usage example:
 * 
 * > requests.post('login/', body)
 */
const requests = {
    delete: async (url, params = {}, headers = {}, source=null) => {   
        if (!source) {
            const CancelToken = axios.CancelToken
            source = new CancelToken(function (_) {})
        }
        try {
            return await axios.delete(`${API_ROOT}${url}`, {
                params: params,
                headers: Object.assign(setHeader(await getToken()), headers),
                cancelToken: source.token
            })
        }
        catch (exception) {
            if (!axios.isCancel(exception)) {
                return await exceptionHandler(exception.response, requests.delete, url, params, headers)
            }
        }
    },
    get: async (url, params = {}, headers = {}, source=null) => {
        // sources are available only in get requests, use them wiselly. With them you can cancel the request on the unmount of a component 
        // or when you change some data in your component. It's a really powerful tool to increase perfomance and mitigate possible bugs.
        if (!source) {
            const CancelToken = axios.CancelToken
            source = new CancelToken(function (_) {})
        }
        try {
            return await axios.get(`${API_ROOT}${url}`, {
                params: params,
                headers: Object.assign(setHeader(await getToken()), headers),
                cancelToken: source.token
            })
        }
        catch (exception) {
            if (!axios.isCancel(exception)) {
                return await exceptionHandler(exception.response, requests.get, url, params, headers)
            }
        }
    },
    put: async (url, body, headers = {}, source=null) => {
        if (!source) {
            const CancelToken = axios.CancelToken
            source = new CancelToken(function (_) {})
        }
        try {
            return await axios.put(`${API_ROOT}${url}`, body, { 
                headers: Object.assign(setHeader(await getToken()), headers),
                cancelToken: source.token
            })
        }
        catch (exception) {
            return await exceptionHandler(exception.response, requests.put, url, body, headers)
        }
    },
    post: async (url, body, headers = {}, source=null) => {
        if (!source) {
            const CancelToken = axios.CancelToken
            source = new CancelToken(function (_) {})
        }
        try {
            return await axios.post(`${API_ROOT}${url}`, body, { 
                headers: Object.assign(setHeader(await getToken()), headers),
                cancelToken: source.token
            })
        }
        catch (exception) {
            if (!axios.isCancel(exception)) {
                return await exceptionHandler(exception.response, requests.post, url, body, headers)
            }
        }
    }
}

export default requests