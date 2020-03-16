import axios from 'axios';
import { API, BEARER } from '../config';
import Router from 'next/router';
import { paths } from 'utils/constants'

const API_ROOT = API;

let token = ''
let companyId = ''

/***
 * Function that sets the token in the header, called inside of the `requests` object functions
 * 
 * @param token - the token, usually the token variable that we set in Layout component
 */
let setHeader = (token) => {
    return {
        'Authorization': `${BEARER} ${token}`
    }
}

/***
 * Function that fires when a exception is catched in the requests object functions.
 * This is only for retrieving a new token while firing a request. This way, the token is refreshed 
 * behind the scenes and doesn't affect the request at all.
 * This goes with the following order:
 * 
 * @param response - the response of the axios exception
 * @param callback - the function to fire with the new token after it has been refreshed. Callbacks are any `requests` functions like: 'get', 'del', etc.
 * @param url - the url parameter from the function
 * @param params - the param or body parameter from the function
 * @param headers - the headers parameter from the function
 */
const refreshToken = async (response, callback, url, params, headers) => {
    if (response !== undefined && response.data && response.data.reason) {
        if (response.data.reason === 'expired_token') {
            response = await requests.get('login/refresh_token/', {}, setHeader(window.localStorage.getItem('refreshToken')))
            // checks if the response was an error and handles it next
            if (response.status !== 200) {
                window.localStorage.setItem('refreshToken', '')
                window.localStorage.setItem('token', '')
                token = ''
            } else {
                window.localStorage.setItem('refreshToken', response.data.refresh_token)
                window.localStorage.setItem('token', response.data.access_token)
                token = response.data.access_token
            }
        }
        if (['invalid_token', 'login_required'].includes(response.data.reason)) {
            Router.push(paths.login())
        }
        return callback(url, params, headers)
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
    delete: async (url, params = {}, headers = {}) => {
        try {
            return await axios.delete(`${API_ROOT}${url}`, {
                params: params,
                headers: Object.assign(setHeader(token), headers)
            })
        }
        catch (exception) {
            return await refreshToken(exception.response, requests.delete, url, params, headers)
        }
    },
    get: async (url, params = {}, headers = {}) => {
        try {
            return await axios.get(`${API_ROOT}${url}`, {
                params: params,
                headers: Object.assign(setHeader(token), headers)
            })
        }
        catch (exception) {
            return await refreshToken(exception.response, requests.get, url, params, headers)
        }
    },
    put: async (url, body, headers = {}) => {
        try {
            return await axios.put(`${API_ROOT}${url}`, body, { headers: Object.assign(setHeader(token), headers) })
        }
        catch (exception) {
            return await refreshToken(exception.response, requests.put, url, body, headers)
        }
    },
    post: async (url, body, headers = {}) => {
        try {
            return await axios.post(`${API_ROOT}${url}`, body, { headers: Object.assign(setHeader(token), headers) })
        }
        catch (exception) {
            return await refreshToken(exception.response, requests.post, url, body, headers)
        }
    }
};


const LOGIN = {
    makeLogin: async (body) => {
        return await requests.post('login/', body)
    }
}


const HOME = {
    getForms: async () => {
        return await requests.get(`${companyId}/data/api/forms/`)
    },
    getUpdateForms: async () => {
        return await requests.get(`${companyId}/settings/api/formulary`)
    },
    updateGroup: async (body, id) => {
        return await requests.put(`${companyId}/settings/api/formulary/${id}/`, body)
    },
    createForm: async (body, groupId) => {
        return await requests.post(`${companyId}/settings/api/formulary/${groupId}/`, body)
    },
    updateForm: async (body, groupId, id) => {
        return await requests.put(`${companyId}/settings/api/formulary/${groupId}/${id}/`, body)
    },
    removeForm: async (groupId, id) => {
        return await requests.delete(`${companyId}/settings/api/formulary/${groupId}/${id}/`)
    }

}


const LISTING = {
    getData: async (params, formName) => {
        return await requests.get(`${companyId}/data/api/data/${formName}/`, params)
    },
    getHeader: async (formName) => {
        return await requests.get(`${companyId}/data/api/listing/${formName}/`)
    },
    getTotals: async (formName) => {
        return await requests.get(`${companyId}/data/api/listing/${formName}/total/`)
    },
    updateSelectedFields: async (body, formName) => {
        return await requests.post(`${companyId}/data/api/listing/${formName}/selected/`, body)
    }
}

const KANBAN = {
    getDataKanban: async (params, formName) => {
        return await requests.get(`${companyId}/data/api/${formName}/`, params)
    },
    getDimensionOrder: async (formName, fieldName) => {
        return await requests.get(`${companyId}/data/api/kanban/${formName}/${fieldName}/`)
    },
    getCardFields: async (formName) => {
        return await requests.get(`${companyId}/data/api/kanban/${formName}/card/`)
    }
}

export default {
    setCompanyId: _companyId => { companyId = _companyId },
    setToken: (_token) => { token = _token; },
    LOGIN,
    HOME,
    LISTING,
    KANBAN
};
