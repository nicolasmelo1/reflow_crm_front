import requests from '../requests'
import { companyId, API_ROOT, appendTokenInUrlByQueryParam } from '../utils'

const RICH_TEXT = {
    getBlockCanContainBlock: async (source) => {
        return requests.get(`rich_text/allowed_blocks_for_blocks/`, {}, {}, source)
    },
    getRichTextImageBlockFile: async (pageId, filaImageUUID) => {
        return await appendTokenInUrlByQueryParam(`${API_ROOT}rich_text/${companyId}/${pageId}/file/image/${filaImageUUID}/`)
    }
}

export default RICH_TEXT