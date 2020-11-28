import requests from '../requests'

const RICH_TEXT = {
    getRichTextData: async (source, richTextPageId) => {
        return await requests.get(`rich_text/${richTextPageId}/`, {}, {}, source)
    }
}

export default RICH_TEXT