import requests from '../requests'
import LOGIN from './login'
import { companyId, API_ROOT, getToken } from '../utils'

const RICH_TEXT = {
    getBlockCanContainBlock: async (source) => {
        return requests.get(`rich_text/allowed_blocks_for_blocks/`, {}, {}, source)
    },
    getRichTextImageBlockFile: async (pageId, filaImageUUID) => {
        await LOGIN.testToken()
        const token = await getToken()
        return `${API_ROOT}rich_text/${companyId}/${pageId}/file/image/${filaImageUUID}/?token=${token}`
    }
}

export default RICH_TEXT