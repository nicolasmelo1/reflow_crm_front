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
    },
    getTemplateSettings: async (source) => {
        return await requests.get(`theme/${companyId}/settings/`, {}, {}, source)
    },
    getTemplateDependsOnSettings: async (source) => {
        return await requests.get(`theme/${companyId}/settings/depends_on/`, {}, {}, source)
    },
    getTemplateFormulariesOptions: async (source) => {
        return await requests.get(`theme/${companyId}/settings/form_options/`, {}, {}, source)
    },
    updateTemplateSettings: async (body, templateId) => {
        return await requests.put(`theme/${companyId}/settings/${templateId}/`, body)
    },
    removeTemplateSettings: async (templateId) => {
        return await requests.delete(`theme/${companyId}/settings/${templateId}/`, {}, {}, {})
    },
    createTemplateSettings: async (body) => {
        return await requests.post(`theme/${companyId}/settings/`, body)
    }
}

export default TEMPLATES