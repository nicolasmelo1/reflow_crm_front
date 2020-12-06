import requests from '../requests'
import { companyId } from '../utils'

const PDF_GENERATOR = {
    getTemplatesSettings: async (source, formName) => {
        return await requests.get(`pdf_generator/${companyId}/${formName}/settings/`, {}, {}, source)
    },
    createTemplate: async (body, formName) => {
        return await requests.post(`pdf_generator/${companyId}/${formName}/settings/`, body)
    },
    updateTemplate: async (body, formName, pdfTemplateConfigurationId) => {
        return await requests.put(`pdf_generator/${companyId}/${formName}/settings/${pdfTemplateConfigurationId}/`, body)
    },
    removeTemplate: async (formName, pdfTemplateConfigurationId) => {
        return await requests.delete(`pdf_generator/${companyId}/${formName}/settings/${pdfTemplateConfigurationId}/`)
    },
    getFieldOptions: async (source, formName) => {
        return await requests.get(`pdf_generator/${companyId}/${formName}/settings/field_options/`, {}, {}, source)
    },
    getTemplates: async (source, formName) => {
        return await requests.get(`pdf_generator/${companyId}/${formName}/`, {}, {}, source)
    },
    getValueOptions: async (source, formName, pdfTemplateConfigurationId, formDataId) => {
        return await requests.get(`pdf_generator/${companyId}/${formName}/${pdfTemplateConfigurationId}/value_options/${formDataId}/`, {}, {}, source)
    }
}

export default PDF_GENERATOR
 