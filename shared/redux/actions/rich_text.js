import agent from '../../utils/agent'


const onGetRichTextDataById = (source, richTextPageId) => {
    return async (_) => {
        return await agent.http.RICH_TEXT.getRichTextData(source, richTextPageId)
    }
}

export default {
    onGetRichTextDataById
}