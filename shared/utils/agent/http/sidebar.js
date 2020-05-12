import requests from '../requests'
import { companyId } from '../utils'

const SIDEBAR = {
    getForms: async (source) => {
        return await requests.get(`${companyId}/data/api/forms/`, {}, {}, source)
    },
    getUpdateForms: async () => {
        return await requests.get(`${companyId}/settings/api/formulary/`)
    },
    getFieldOptions: async (formId) => {
        return await requests.get(`${companyId}/settings/api/formulary/${formId}/field_options/`)
    },
    updateGroup: async (body, groupId) => {
        return await requests.put(`${companyId}/settings/api/formulary/groups/${groupId}/`, body)
    },
    removeGroup: async (groupId) => {
        return await requests.delete(`${companyId}/settings/api/formulary/groups/${groupId}/`, {} , {} , {})
    },
    createForm: async (body) => {
        return await requests.post(`${companyId}/settings/api/formulary/forms/`, body)
    },
    updateForm: async (body, formularyId) => {
        return await requests.put(`${companyId}/settings/api/formulary/forms/${formularyId}/`, body)
    },
    removeForm: async (formularyId) => {
        return await requests.delete(`${companyId}/settings/api/formulary/forms/${formularyId}/`)
    }
}

export default SIDEBAR