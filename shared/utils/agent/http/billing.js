import requests from '../requests'
import { companyId } from '../utils'


const BILLING = {
    getAddressOptions: async (source) => {
        return await requests.get(`billing/${companyId}/settings/address_options/`, {}, {}, source)
    },
    getPaymentData: async (source) => {
        return await requests.get(`billing/${companyId}/settings/`, {}, {}, source)
    },
    getCompanyData: async (source) => {
        return await requests.get(`authentication/settings/company/${companyId}/`, {}, {}, source)
    }
}

export default BILLING