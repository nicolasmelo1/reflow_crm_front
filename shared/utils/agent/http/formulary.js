import requests from '../requests'
import { companyId, API_ROOT, appendTokenInUrlByQueryParam } from '../utils'


const FORMULARY = {
    getDraftStringIdFromDefaultAttachment: async (source, formName, fieldId, fileName) => {
        return await requests.get(`formulary/${companyId}/${formName}/${fieldId}/defaults/draft/${fileName}/`, {}, {}, source)
    },
    getFormularyUserOptions: async (source, formName, fieldId) => {
        return await requests.get(`formulary/${companyId}/${formName}/${fieldId}/user/options/`, {}, {}, source)
    },
    getBuildFormulary: async (source, formName) => {
        return await requests.get(`formulary/${companyId}/${formName}/`, {}, {}, source)
    },
    createFormularyData: async (body, formName) => {
        return await requests.post(`data/${companyId}/${formName}/`, body)
    },
    getFormularyData: async (formName, formId) => {
        return await requests.get(`data/${companyId}/${formName}/${formId}/`, {}, {}, null)
    },
    updateFormularyData: async (body, formName, formId, duplicate=null) => {
        const duplicateUrl = (duplicate) ? '?duplicate=duplicate' : ''
        return await requests.put(`data/${companyId}/${formName}/${formId}/${duplicateUrl}`, body)
    },
    getFormularyFormFieldOptions: async (source, formName, fieldId, page=1, search=null, valueId=null) => {
        let params = { page: page }
        if (search) {
            params.search = search
        } 
        if (valueId) {
            params.value_id = valueId
        }
        return await requests.get(`formulary/${companyId}/${formName}/${fieldId}/form/options/`, params, {}, source)
    },
    getAttachmentFile: async (formName, formularyId, fieldId, fileName) => {
        fileName = encodeURIComponent(fileName)
        return await appendTokenInUrlByQueryParam(`${API_ROOT}data/${companyId}/${formName}/${formularyId}/${fieldId}/${fileName}/`)
    },
    getFormularySettingsData: async (source, formId) => {
        return await requests.get(`formulary/${companyId}/settings/forms/${formId}/`, {}, {}, source)
    },
    createFormularySettingsSection: async (body, formId) => {
        return await requests.post(`formulary/${companyId}/settings/sections/${formId}/`, body)
    },
    updateFormularySettingsSection: async (body, formId, sectionId) => {
        return await requests.put(`formulary/${companyId}/settings/sections/${formId}/${sectionId}/`, body)
    },
    removeFormularySettingsSection: async (formId, sectionId) => {
        return await requests.delete(`formulary/${companyId}/settings/sections/${formId}/${sectionId}/`)
    },
    createFormularySettingsField: async (body, formId) => {
        return await requests.post(`formulary/${companyId}/settings/fields/${formId}/`, body)
    },
    updateFormularySettingsField: async (body, formId, fieldId) => {
        return await requests.put(`formulary/${companyId}/settings/fields/${formId}/${fieldId}/`, body)
    },
    removeFormularySettingsField: async (formId, fieldId) => {
        return await requests.delete(`formulary/${companyId}/settings/fields/${formId}/${fieldId}/`)
    },
    getFormularySettingsDefaultAttachmentFile: async (formId, fieldId, fileName) => {
        return await appendTokenInUrlByQueryParam(`${API_ROOT}formulary/${companyId}/settings/fields/${formId}/${fieldId}/defaults/${fileName}/`)
    }, 
    testFormularyFormulaField: async (body, formId) => {
        return await requests.post(`formula/${companyId}/${formId}/`, body)
    },
    getFormularySettingsConnectionFieldOptions: async (source, formId) => {
        return await requests.get(`formulary/${companyId}/settings/fields/${formId}/form/field_options/`, {}, {}, source)
    },
    updatePublicFormularySettings: async (body, formId) => {
        return await requests.post(`formulary/${companyId}/settings/${formId}/public/`, body)
    },
    getPublicFormularySettings: async (source, formId) => {
        return await requests.get(`formulary/${companyId}/settings/${formId}/public/`, {}, {}, source)
    },
    getPublicFormularyData: async (source, formName) => {
        return await requests.get(`formulary/public/${companyId}/form/${formName}/`, {}, {}, source)
    }
}

export default FORMULARY
