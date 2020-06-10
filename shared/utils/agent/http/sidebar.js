import requests from '../requests'
import { companyId } from '../utils'

const SIDEBAR = {
    getForms: async (source) => {
        return await requests.get(`formulary/${companyId}/`, {}, {}, source)
    },
    getUpdateForms: async () => {
        return await requests.get(`formulary/${companyId}/settings/groups/`)
    },
    getFieldOptions: async (formId) => {
        return await requests.get(`${companyId}/settings/api/formulary/${formId}/field_options/`)
    },
    updateGroup: async (body, groupId) => {
        return await requests.put(`formulary/${companyId}/settings/groups/${groupId}/`, body)
    },
    removeGroup: async (groupId) => {
        return await requests.delete(`formulary/${companyId}/settings/groups/${groupId}/`, {} , {} , {})
    },
    createForm: async (body) => {
        return await requests.post(`formulary/${companyId}/settings/forms/`, body)
    },
    updateForm: async (body, formularyId) => {
        return await requests.put(`formulary/${companyId}/settings/forms/${formularyId}/`, body)
    },
    removeForm: async (formularyId) => {
        return await requests.delete(`formulary/${companyId}/settings/forms/${formularyId}/`)
    }
}

export default SIDEBAR