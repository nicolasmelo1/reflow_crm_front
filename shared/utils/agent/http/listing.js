import requests from '../requests'
import { API_ROOT, getToken, companyId } from '../utils'


const LISTING = {
    getRenderData: async (source, formName) => {
        return await requests.get(`listing/${companyId}/${formName}/`, {}, {}, source)
    },
    getHasExportedData: async (formName, fileId, isToDownload) => {
        const path = `data/${companyId}/${formName}/extract/${fileId}/`
        if (isToDownload) {
            getToken().then(token => {
                window.open(`${API_ROOT}${path}?download=download&token=${token}`)
            })
        }
        return await requests.get(path)
    },
    exportData: async (params, formName) => {
        return await requests.post(`data/${companyId}/${formName}/extract/`, params)
    },
    removeData: async (formName, formId) => {
        return await requests.delete(`data/${companyId}/${formName}/${formId}/`)
    },
    getData: async (source, params, formName) => {
        return await requests.get(`data/${companyId}/${formName}/all/`, params, {}, source)
    },
    updateSelectedFields: async (body, formName) => {
        return await requests.put(`listing/${companyId}/${formName}/`, body)
    }
}

export default LISTING