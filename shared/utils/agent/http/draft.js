import requests from '../requests'
import LOGIN from './login'
import { companyId, formEncodeData, API_ROOT, getToken } from '../utils'

const DRAFT = {
    getDraftFile: async (draftStringId) => {
        await LOGIN.testToken()
        const token = await getToken()
        return `${API_ROOT}draft/${companyId}/file/${draftStringId}/?token=${token}`
    },
    createDraftFile: async (source, file) => {
        return await requests.post(`draft/${companyId}/file/`, formEncodeData(``, null, [{name: file.name, file: file}]), {'Content-Type': 'multipart/form-data'}, source)
    },
    duplicateDraft: async (draftStringId) => {
        return await requests.get(`draft/${companyId}/${draftStringId}/duplicate/`)
    },
    removeDraft: async (draftStringId) => {
        return await requests.delete(`draft/${companyId}/${draftStringId}/`)
    }
}

export default DRAFT