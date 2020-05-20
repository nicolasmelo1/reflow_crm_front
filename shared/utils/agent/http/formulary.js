import requests from '../requests'
import LOGIN from './login'
import { getToken, companyId, API_ROOT, formEncodeData } from '../utils'


const FORMULARY = {
    getFormularyUserOptions: async (source, formName) => {
        return await requests.get(`${companyId}/formulary/api/${formName}/user/options/`, {}, {}, source)
    },
    getBuildFormulary: async (source, formName) => {
        return await requests.get(`${companyId}/formulary/api/${formName}/`, {}, {}, source)
    },
    createFormularyData: async (body, files, formName) => {
        return await requests.post(`${companyId}/formulary/api/${formName}/`, formEncodeData('data', body, files), {'Content-Type': 'multipart/form-data'})
    },
    getFormularyData: async (source, formName, formId) => {
        return await requests.get(`${companyId}/formulary/api/${formName}/${formId}/`, {}, {}, source)
    },
    updateFormularyData: async (body, files, formName, formId) => {
        return await requests.post(`${companyId}/formulary/api/${formName}/${formId}/`, formEncodeData('data', body, files), {'Content-Type': 'multipart/form-data'})
    },
    getFormularyFormFieldOptions: async (source, formName, fieldId) => {
        return await requests.get(`${companyId}/formulary/api/${formName}/${fieldId}/form/options/`, {}, {}, source)
    },
    getAttachmentFile: async (formName, formularyId, fieldId, fileName) => {
        await LOGIN.testToken()
        const token = await getToken()
        return `${API_ROOT}${companyId}/formulary/${formName}/${formularyId}/${fieldId}/${fileName}/?token=${token}`
    },
    getFormularySettingsData: async (source, formId) => {
        return await requests.get(`${companyId}/settings/api/formulary/${formId}/sections/`, {}, {}, source)
    },
    createFormularySettingsSection: async (body, formId) => {
        return await requests.post(`${companyId}/settings/api/formulary/${formId}/sections/`, body)
    },
    updateFormularySettingsSection: async (body, formId, sectionId) => {
        return await requests.put(`${companyId}/settings/api/formulary/${formId}/sections/${sectionId}/`, body)
    },
    removeFormularySettingsSection: async (formId, sectionId) => {
        return await requests.delete(`${companyId}/settings/api/formulary/${formId}/sections/${sectionId}/`)
    },
    createFormularySettingsField: async (body, formId) => {
        return await requests.post(`${companyId}/settings/api/formulary/${formId}/fields/`, body)
    },
    updateFormularySettingsField: async (body, formId, fieldId) => {
        return await requests.put(`${companyId}/settings/api/formulary/${formId}/fields/${fieldId}/`, body)
    },
    removeFormularySettingsField: async (formId, fieldId) => {
        return await requests.delete(`${companyId}/settings/api/formulary/${formId}/fields/${fieldId}/`)
    },
    testFormularyFormulaField: async (source, formId, text) => {
        return await requests.get(`${companyId}/formula/${formId}/`, { text: text }, {}, source)
    }
}

export default FORMULARY
