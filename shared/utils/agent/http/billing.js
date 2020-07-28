import requests from '../requests'
import { companyId } from '../utils'


const BILLING = {
    getAddressOptions: async (source) => {
        return await requests.get(`billing/${companyId}/settings/address_options/`, {}, {}, source)
    },
    updatePaymentData: async (body) => {
        return await requests.put(`billing/${companyId}/settings/`, body)
    },
    removeCreditCard: async () => {
        return await requests.delete(`billing/${companyId}/settings/credit_card/`)
    },
    getPaymentData: async (source) => {
        return await requests.get(`billing/${companyId}/settings/`, {}, {}, source)
    },
    getTotals: async (body) => {
        return await requests.post(`billing/${companyId}/settings/totals/`, body)
    }
}

export default BILLING