import { AsyncStorage }from 'react-native'
import { BEARER, API } from '../../config'


const API_ROOT = API;
let companyId = null


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
    const token = process.env['APP'] === 'web' ? window.localStorage.getItem('token') : await AsyncStorage.getItem('token')
    return token
}

const formEncodeData = (appendToKey, body, files = []) => {
    let formData = new FormData();
    formData.append(appendToKey, JSON.stringify(body));
    files.forEach(file=> {
        formData.append(file.name, file.file)
    })
    return formData
}

const setCompanyId = (_companyId) => {
    companyId = _companyId
}


export { 
    setCompanyId,
    companyId,
    formEncodeData,
    getToken,
    setHeader,
    API_ROOT
}