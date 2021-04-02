import requests from '../requests'
import { companyId, formEncodeData, API_ROOT, appendTokenInUrlByQueryParam } from '../utils'

const DRAFT = {
    getDraftFile: async (draftStringId) => {
        return await appendTokenInUrlByQueryParam(`${API_ROOT}draft/${companyId}/file/${draftStringId}/`)
    },
    createDraftFile: async (file) => {
        console.log(file)
        return await requests.post(`draft/${companyId}/file/`, formEncodeData(``, null, [{name: file.name, file: file}]), {'Content-Type': 'multipart/form-data'})
    },
    removeDraft: async (draftStringId) => {
        return await requests.delete(`draft/${companyId}/${draftStringId}/`)
    }
}

export default DRAFT