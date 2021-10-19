import { BEARER, API } from '../../config'
import base64 from '../base64'
import LOGIN from './http/login'

let AsyncStorage;
if (process.env['APP'] !== 'web') { 
    AsyncStorage = require('react-native').AsyncStorage
}

const API_ROOT = API
let companyId = null
let logoutFunctionForView = null
let permissionsHandlerForView = null
let publicAccessKey = null
// ------------------------------------------------------------------------------------------
const setStorageToken = async (tokenValue, refreshTokenValue) => {
    if (process.env['APP'] === 'web') {
        window.localStorage.setItem('refreshToken', refreshTokenValue)
        window.localStorage.setItem('token', tokenValue)
    } else {
        await AsyncStorage.setItem('refreshToken', refreshTokenValue)
        await AsyncStorage.setItem('token', tokenValue)
    }
}
// ------------------------------------------------------------------------------------------
/**
 * Function that sets the token in the header, called inside of the `requests` object functions
 * 
 * @param token - the token, usually the token variable that we set in Layout component
 */
const setHeader = (token) => {
    return {
        'Authorization': `${BEARER} ${token}`
    }
}
// ------------------------------------------------------------------------------------------
/**
 * This is responsible for adding the `token` param to the url. Sometimes we cannot authenticate via the header (for example, we
 * are retrieving an image from the server in a img html tag). On this example we cannot access the header of the request. So we need to
 * add the token as a query parameter in the request. This way we are able to authenticate even if the request does not have a bearer Header.
 * 
 * When the publicAccessKey is defined we bypass all this and only adds the public_key parameter.
 * 
 * @param {String} url - The url you want to append the token to
 * 
 * @returns {String} - The url with the token appendend
 */
const appendTokenInUrlByQueryParam = async (url) => {
    if (publicAccessKey === null) {
        await LOGIN.testToken()
        const token = await getToken()
        if (url.includes('?')) {
            url = url + `&token=${token}`
        } else {
            url = url + `?token=${token}`
        }
    } else if (url.includes('?')) {
        url = url + `&public_key=${publicAccessKey}`
    } else {
        url = url + `?public_key=${publicAccessKey}`
    }
        
    return url 
}
// ------------------------------------------------------------------------------------------
const getToken = async () => {
    if (process.env['APP'] !== 'web'){
        const AsyncStorage = require('react-native').AsyncStorage
        return await AsyncStorage.getItem('token')
    } else {
        return window.localStorage.getItem('token') 
    }
}
// ------------------------------------------------------------------------------------------
const formEncodeData = (appendToKey='', body=null, files = []) => {
    let formData = new FormData()
    if (appendToKey !== '' && body !== null) {
        formData.append(appendToKey, JSON.stringify(body))
    }
    files.forEach(file=> {
        formData.append(base64.encode(file.name), file.file)
    })
    return formData
}
// ------------------------------------------------------------------------------------------
/**
 * This might be confusing at first for some new comers, but this function,`setLogout`, `setPublicAccessKey` and `setPermissionsHandler` functions
 * are injecting data to this file. So when we import the values we actually have access to the injected values.
 * 
 * WHAT? When we render the Layout component, we inject values to the `companyId`, the `logoutFunctionForView` and `permissionsHandlerForView` variables. 
 * This way on requests.js file where we are importing `companyId`, `setPermissionsHandler`, `logoutFunctionForView` we can access them not as null
 * but as the values we injected.
 */
const setCompanyId = (_companyId) => {
    companyId = _companyId
}
// ------------------------------------------------------------------------------------------
const setPublicAccessKey = (_publicAccessKey) => {
    publicAccessKey = _publicAccessKey
}
// ------------------------------------------------------------------------------------------
const setLogout = (_logoutFunctionForView) => {
    logoutFunctionForView = _logoutFunctionForView
}
// ------------------------------------------------------------------------------------------
const setPermissionsHandler = (_permissionsHandlerForView) => {
    permissionsHandlerForView = _permissionsHandlerForView
}
// ------------------------------------------------------------------------------------------
export {
    appendTokenInUrlByQueryParam,
    setPublicAccessKey,
    setStorageToken,
    setPermissionsHandler,
    setLogout,
    setCompanyId,
    permissionsHandlerForView,
    logoutFunctionForView,
    companyId,
    publicAccessKey,
    formEncodeData,
    getToken,
    setHeader,
    API_ROOT
}