import requests from '../requests'
import { companyId } from '../utils'

const ONBOARDING = {
    createUserAndCompany: async (body) => {
        return await requests.post('authentication/onboarding/', body)
    },
    bulkCreateFormulary: async (body) => {
        return await requests.post(`formulary/${companyId}/settings/bulk_create/`, body)
    }
}

export default ONBOARDING
 