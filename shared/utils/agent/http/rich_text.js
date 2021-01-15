import requests from '../requests'
import LOGIN from './login'
import { companyId, API_ROOT, getToken } from '../utils'

const RICH_TEXT = {
    getRichTextImageBlockFile: async (pageId, blockUUID, fileName) => {
        await LOGIN.testToken()
        const token = await getToken()
        return `${API_ROOT}rich_text/${companyId}/${pageId}/${blockUUID}/file/image/${fileName}/?token=${token}`
    },
    duplicateRichTextImageBlockFile: async (pageId, blockUUID, fileName) => {
        return requests.put(`rich_text/${companyId}/${pageId}/${blockUUID}/file/image/${fileName}/`, {})
    }
}

export default RICH_TEXT