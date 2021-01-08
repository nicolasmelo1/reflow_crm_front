import { BEARER, API } from '../../config'
let AsyncStorage;
if (process.env['APP'] !== 'web') { 
    AsyncStorage = require('react-native').AsyncStorage
}

const API_ROOT = API;
let companyId = null
let logoutFunctionForView = null
let permissionsHandlerForView = null

const setStorageToken = async (tokenValue, refreshTokenValue) => {
    if (process.env['APP'] === 'web') {
        window.localStorage.setItem('refreshToken', refreshTokenValue)
        window.localStorage.setItem('token', tokenValue)
    } else {
        await AsyncStorage.setItem('refreshToken', refreshTokenValue)
        await AsyncStorage.setItem('token', tokenValue)
    }
}

/***
 * Function that sets the token in the header, called inside of the `requests` object functions
 * 
 * @param token - the token, usually the token variable that we set in Layout component
 */
const setHeader = (token) => {
    return {
        'Authorization': `${BEARER} ${token}`
    }
}

const getToken = async () => {
    if (process.env['APP'] !== 'web'){
        const AsyncStorage = require('react-native').AsyncStorage
        return await AsyncStorage.getItem('token')
    } else {
        return window.localStorage.getItem('token') 
    }
}

const formEncodeData = (appendToKey='', body=null, files = []) => {
    let formData = new FormData()
    if (appendToKey !== '' && body !== null) {
        formData.append(appendToKey, JSON.stringify(body))
    }
    files.forEach(file=> {
        formData.append(file.name, file.file)
    })
    return formData
}

/**
 * This might be confusing at first for some new comers, but this function,`setLogout` and `setPermissionsHandler` functions
 * are injecting data to this file. So when we import the values we actually have access to the injected values.
 * 
 * WHAT? When we render the Layout component, we inject values to the `companyId`, the `logoutFunctionForView` and `permissionsHandlerForView` variables. 
 * This way on requests.js file where we are importing `companyId`, `setPermissionsHandler`, `logoutFunctionForView` we can access them not as null
 * but as the values we injected.
 */
const setCompanyId = (_companyId) => {
    companyId = _companyId
}

const setLogout = (_logoutFunctionForView) => {
    logoutFunctionForView = _logoutFunctionForView
}

const setPermissionsHandler = (_permissionsHandlerForView) => {
    permissionsHandlerForView = _permissionsHandlerForView
}

export { 
    setStorageToken,
    setPermissionsHandler,
    setLogout,
    setCompanyId,
    permissionsHandlerForView,
    logoutFunctionForView,
    companyId,
    formEncodeData,
    getToken,
    setHeader,
    API_ROOT
}