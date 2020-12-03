import requests from '../requests'
import { companyId } from '../utils'

const PDF_GENERATOR = {
    getTemplates: async (source, formName) => {
        return await requests.get(`pdf_generator/${companyId}/${formName}/settings/`, {}, {}, source)
    },
    createTemplate: async (body, formName) => {
        return await requests.post(`pdf_generator/${companyId}/${formName}/settings/`, body)
    },
    updateTemplate: async (body, formName, pdfTemplateConfigurationId) => {
        return await requests.put(`pdf_generator/${companyId}/${formName}/settings/${pdfTemplateConfigurationId}/`, body)
    },
    getFieldOptions: async (source, formName) => {
        return await requests.get(`pdf_generator/${companyId}/${formName}/settings/field_options/`, {}, {}, source)
    }
}

export default PDF_GENERATOR
 