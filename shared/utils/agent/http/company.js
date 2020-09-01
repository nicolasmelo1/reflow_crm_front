import requests from '../requests'
import { companyId } from '../utils'
import company from '../../../redux/actions/company'

const COMPANY = {
    getCompanyData: async (source) => {
        return await requests.get(`authentication/${companyId}/company/`, {}, {}, source)
    },
    getCompanySettingsData: async (source) => {
        return await requests.get(`authentication/settings/${companyId}/company/`, {}, {}, source)
    }, 
    updateCompanySettingsData: async (body) => {
        return await requests.put(`authentication/settings/${companyId}/company/`, body)
    }
}

export default COMPANY