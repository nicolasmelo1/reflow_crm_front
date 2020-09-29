import requests from '../requests'
import { companyId } from '../utils'

const TEMPLATES = {
    getSelectTemplates: async (source, groupName , page, filter) => {
        const params = { page: page, filter: filter}
        return await requests.get(`theme/${companyId}/theme_type/${groupName}/`, params, {}, source)
    },
    getSelectTemplate: async (source, templateId) => {
        return await requests.get(`theme/${companyId}/${templateId}/`, {}, {}, source)
    },
    getSelectTemplateFormulary: async (source, templateId, templateFormId) => {
        return await requests.get(`theme/${companyId}/${templateId}/${templateFormId}/`, {}, {}, source)
    },
    useTemplate: async (templateId) => {
        return await requests.post(`theme/${companyId}/${templateId}/select/`, {}, {}, {})
    }
}

export default TEMPLATES