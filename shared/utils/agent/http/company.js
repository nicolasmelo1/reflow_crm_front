import requests from '../requests'
import { companyId, formEncodeData } from '../utils'

const COMPANY = {
    getCompanyData: async (source) => {
        return await requests.get(`authentication/${companyId}/company/`, {}, {}, source)
    },
    getCompanySettingsData: async (source) => {
        return await requests.get(`authentication/settings/${companyId}/company/`, {}, {}, source)
    }, 
    updateCompanySettingsData: async (body, files) => {
        return await requests.post(`authentication/settings/${companyId}/company/`, formEncodeData(`data`, body, files), { 'Content-Type': `multipart/form-data`})
    }
}

export default COMPANY