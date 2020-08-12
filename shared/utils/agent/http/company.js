import requests from '../requests'
import { companyId } from '../utils'

const COMPANY = {
    getCompanyData: async (source) => {
        return await requests.get(`authentication/${companyId}/company/`, {}, {}, source)
    }
}

export default COMPANY