import requests from '../requests'
import LOGIN from './login'
import { getToken, companyId, API_ROOT, formEncodeData } from '../utils'


const FORMULARY = {
    getFormularyUserOptions: async (source, formName, fieldId) => {
        return await requests.get(`formulary/${companyId}/${formName}/${fieldId}/user/options/`, {}, {}, source)
    },
    getBuildFormulary: async (source, formName) => {
        return await requests.get(`formulary/${companyId}/${formName}/`, {}, {}, source)
    },
    createFormularyData: async (body, files, formName) => {
        return await requests.post(`formulary/${companyId}/api/${formName}/`, formEncodeData('data', body, files), {'Content-Type': 'multipart/form-data'})
    },
    getFormularyData: async (source, formName, formId) => {
        return await requests.get(`formulary/${companyId}/${formName}/${formId}/`, {}, {}, source)
    },
    updateFormularyData: async (body, files, formName, formId, duplicate=null) => {
        const duplicateUrl = (duplicate) ? '?duplicate=duplicate' : ''
        return await requests.post(`formulary/${companyId}/${formName}/${formId}/${duplicateUrl}`, formEncodeData('data', body, files), {'Content-Type': 'multipart/form-data'})
    },
    getFormularyFormFieldOptions: async (source, formName, fieldId) => {
        return await requests.get(`formulary/${companyId}/${formName}/${fieldId}/form/options/`, {}, {}, source)
    },
    getAttachmentFile: async (formName, formularyId, fieldId, fileName) => {
        await LOGIN.testToken()
        const token = await getToken()
        return `${API_ROOT}formulary/${companyId}/${formName}/${formularyId}/${fieldId}/${fileName}/?token=${token}`
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
    testFormularyFormulaField: async (source, formId, text) => {
        return await requests.get(`formulary/${companyId}/formula/${formId}/`, { text: text }, {}, source)
    }
}

export default FORMULARY
