import requests from '../requests'

const RICH_TEXT = {
    getTestText: async (source) => {
        return await requests.get(`rich_text/test_text/1/`, {}, {}, source)
    }
}

export default RICH_TEXT