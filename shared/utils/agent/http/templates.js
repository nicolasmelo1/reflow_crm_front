import requests from '../requests'
import { companyId } from '../utils'

const TEMPLATES = {
    getSelectTemplates: async (source, groupName , page, filter) => {
        const params = { page: page, filter: filter}
        return await requests.get(`${companyId}/settings/api/themes/select/company_type/${groupName}/`, params, {}, source)
    },
    getSelectTemplate: async (source, templateId) => {
        return await requests.get(`${companyId}/settings/api/themes/select/${templateId}/`, {}, {}, source)
    },
    getSelectTemplateFormulary: async (source, templateId, templateFormId) => {
        return await requests.get(`${companyId}/settings/api/themes/select/${templateId}/${templateFormId}/`, {}, {}, source)
    },
    useTemplate: async (templateId) => {
        return await requests.post(`${companyId}/settings/api/themes/select/${templateId}/`, {}, {}, {})
    }
}

export default TEMPLATES