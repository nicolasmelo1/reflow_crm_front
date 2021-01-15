import agent from '../../utils/agent'

const onDuplicateRichtTextImageBlockExistingFile = (pageId, blockUUID, fileName) => {
    return async (_) => {
        return await agent.http.RICH_TEXT.duplicateRichTextImageBlockFile(pageId, blockUUID, fileName)
    }
}

export default {
    onDuplicateRichtTextImageBlockExistingFile
}