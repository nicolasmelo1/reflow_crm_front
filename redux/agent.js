import axios from 'axios'
import { API, BEARER } from 'config'
import { paths } from 'utils/constants'
import Router from 'next/router'

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
 * 
 * @param response - the response of the axios exception
 * @param callback - the function to fire with the new token after it has been refreshed. Callbacks are any `requests` functions like: 'get', 'del', etc.
 * @param url - the url parameter from the function
 * @param params - the param or body parameter from the function
 * @param headers - the headers parameter from the function
 */
const refreshToken = async (response, callback, url, params, headers) => {
    if (response && response.data && response.data.reason && ['invalid_token', 'login_required', 'expired_token'].includes(response.data.reason)) {
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
            return callback(url, params, headers)
        }
        if (['invalid_token', 'login_required'].includes(response.data.reason)) {
            Router.push(paths.login())
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
                headers: Object.assign(setHeader(token), headers),
                cancelToken: source.token
            })
        }
        catch (exception) {
            if (!axios.isCancel(exception)) {
                return await refreshToken(exception.response, requests.get, url, params, headers)
            }
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

const formEncodeData = (appendToKey, body, files = []) => {
    let formData = new FormData();
    formData.append(appendToKey, JSON.stringify(body));
    files.forEach(file=> {
        formData.append(file.name, file.file)
    })
    return formData
}

const LOGIN = {
    makeLogin: async (body) => {
        return await requests.post('login/', body)
    },
    getDataTypes: async () => {
        return await requests.get('types/')
    }
}


const FORMULARY = {
    getBuildFormulary: async (source, formName) => {
        return await requests.get(`${companyId}/formulary/api/${formName}/`, {}, {}, source)
    },
    createFormularyData: async (body, files, formName) => {
        return await requests.post(`${companyId}/formulary/api/${formName}/`, formEncodeData('data', body, files), {'Content-Type': 'multipart/form-data'})
    },
    getFormularyData: async (source, formName, formId) => {
        return await requests.get(`${companyId}/formulary/api/${formName}/${formId}/`, {}, {}, source)
    },
    updateFormularyData: async (body, files, formName, formId) => {
        return await requests.post(`${companyId}/formulary/api/${formName}/${formId}/`, formEncodeData('data', body, files), {'Content-Type': 'multipart/form-data'})
    },
    getFormularyFormFieldOptions: async (source, formName, fieldId) => {
        return await requests.get(`${companyId}/formulary/api/${formName}/${fieldId}/form/options/`, {}, {}, source)
    },
    getAttachmentFile: (formName, formularyId, fieldId, fileName) => {
        return `${API_ROOT}${companyId}/formulary/${formName}/${formularyId}/${fieldId}/${fileName}/?token=${token}`
    },
    getFormularySettingsData: async (source, formId) => {
        return await requests.get(`${companyId}/settings/api/formulary/${formId}/sections/`, {}, {}, source)
    },
    createFormularySettingsSection: async (body, formId) => {
        return await requests.post(`${companyId}/settings/api/formulary/${formId}/sections/`, body)
    },
    updateFormularySettingsSection: async (body, formId, sectionId) => {
        return await requests.put(`${companyId}/settings/api/formulary/${formId}/sections/${sectionId}/`, body)
    },
    removeFormularySettingsSection: async (formId, sectionId) => {
        return await requests.delete(`${companyId}/settings/api/formulary/${formId}/sections/${sectionId}/`)
    },
    createFormularySettingsField: async (body, formId) => {
        return await requests.post(`${companyId}/settings/api/formulary/${formId}/fields/`, body)
    },
    updateFormularySettingsField: async (body, formId, fieldId) => {
        return await requests.put(`${companyId}/settings/api/formulary/${formId}/fields/${fieldId}/`, body)
    },
    removeFormularySettingsField: async (formId, fieldId) => {
        return await requests.delete(`${companyId}/settings/api/formulary/${formId}/fields/${fieldId}/`)
    }
}


const HOME = {
    getForms: async () => {
        return await requests.get(`${companyId}/data/api/forms/`)
    },
    getUpdateForms: async () => {
        return await requests.get(`${companyId}/settings/api/formulary`)
    },
    getFieldOptions: async (formId) => {
        return await requests.get(`${companyId}/settings/api/formulary/${formId}/field_options/`)
    },
    updateGroup: async (body, id) => {
        return await requests.put(`${companyId}/settings/api/formulary/groups/${id}/`, body)
    },
    createForm: async (body) => {
        return await requests.post(`${companyId}/settings/api/formulary/forms/`, body)
    },
    updateForm: async (body, formularyId) => {
        return await requests.put(`${companyId}/settings/api/formulary/forms/${formularyId}/`, body)
    },
    removeForm: async (formularyId) => {
        return await requests.delete(`${companyId}/settings/api/formulary/forms/${formularyId}/`)
    }
}


const LISTING = {
    getRenderData: async (source, formName) => {
        return await requests.get(`${companyId}/data/api/listing/${formName}/`, {}, {}, source)
    },
    getHasExportedData: async (isToDownload) => {
        const path = `${companyId}/data/api/extract/`
        if (isToDownload) {
            window.open(`${API_ROOT}${path}?download=download&token=${token}`)
        }
        return await requests.get(path)
    },
    exportData: async (params, formName) => {
        return await requests.post(`${companyId}/data/api/extract/${formName}/`, params)
    },
    removeData: async (formName, formId) => {
        return await requests.delete(`${companyId}/formulary/api/${formName}/${formId}/`)
    },
    getData: async (source, params, formName) => {
        return await requests.get(`${companyId}/data/api/data/${formName}/`, params, {}, source)
    },
    getTotals: async (params, formName) => {
        return await requests.get(`${companyId}/data/api/listing/${formName}/total/`, params)
    },
    createTotal: async (body, formName) => {
        return await requests.post(`${companyId}/data/api/listing/${formName}/total/`, body)
    },
    removeTotal: async (formName, totalId) => {
        return await requests.delete(`${companyId}/data/api/listing/${formName}/total/${totalId}`)
    },
    updateSelectedFields: async (body, formName) => {
        return await requests.post(`${companyId}/data/api/listing/${formName}/selected/`, body)
    }
}

const KANBAN = {
    getRenderData: async (source, formName) => {
        return await requests.get(`${companyId}/data/api/kanban/${formName}/`, {}, {}, source)
    },
    getCards: async (source, formName) => {
        return await requests.get(`${companyId}/data/api/kanban/${formName}/card/`, {}, {}, source)
    },
    createCard: async (body,formName) => {
        return await requests.post(`${companyId}/data/api/kanban/${formName}/card/`, body)
    },
    updateCard: async (body, formName, kanbanCardId) => {
        return await requests.put(`${companyId}/data/api/kanban/${formName}/card/${kanbanCardId}/`, body)
    },
    removeCard: async(formName, kanbanCardId) => {
        return await requests.delete(`${companyId}/data/api/kanban/${formName}/card/${kanbanCardId}/`)
    },
    updateDefaults: async (body, formName) => {
        return await requests.put(`${companyId}/data/api/kanban/${formName}/defaults/`, body)
    },
    getDimensionOrders: async (source, formName, dimensionId) => {
        return await requests.get(`${companyId}/data/api/kanban/${formName}/dimension/${dimensionId}/`, {}, {}, source)
    },
    updateDimensionOrders: async (body, formName, dimensionId) => {
        return await requests.put(`${companyId}/data/api/kanban/${formName}/dimension/${dimensionId}/`, body)
    },
    getData: async (source, params, formName) => {
        return await requests.get(`${companyId}/data/api/data/${formName}/`, params, {}, source)
    },
    updateCardDimension: async(body, formName) => {
        return await requests.put(`${companyId}/data/api/kanban/${formName}/change/`, body)
    }
}

export default {
    setCompanyId: _companyId => { companyId = _companyId },
    setToken: (_token) => { token = _token },
    LOGIN,
    HOME,
    LISTING,
    KANBAN,
    FORMULARY
};
