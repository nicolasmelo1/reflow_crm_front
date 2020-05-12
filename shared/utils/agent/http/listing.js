import requests from '../requests'
import { API_ROOT, getToken, companyId } from '../utils'


const LISTING = {
    getRenderData: async (source, formName) => {
        return await requests.get(`${companyId}/data/api/listing/${formName}/`, {}, {}, source)
    },
    getHasExportedData: async (isToDownload) => {
        const path = `${companyId}/data/api/extract/`
        if (isToDownload) {
            getToken().then(token => {
                window.open(`${API_ROOT}${path}?download=download&token=${token}`)
            })
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

export default LISTING