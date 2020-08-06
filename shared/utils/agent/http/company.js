import requests from '../requests'
import { companyId } from '../utils'

const COMPANY = {
    getCompanyData: async (source) => {
        return await requests.get(`authentication/company/${companyId}/`, {}, {}, source)
    }
}

export default COMPANY