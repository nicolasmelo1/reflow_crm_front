import requests from '../requests'
import { companyId } from '../utils'

const USERS = {
    getFormularyAndFieldOptions: async (source) => {
        return await requests.get(`authentication/settings/${companyId}/users/formulary_options/`, {}, {}, source)
    },
    getUsersConfiguration: async (source) => {
        return await requests.get(`authentication/settings/${companyId}/users/`, {}, {}, source)
    }
}

export default USERS