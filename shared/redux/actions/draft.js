import agent from '../../utils/agent'
 
const onCreateDraftFile = (file) => {
    return async (_) => {
        return await agent.http.DRAFT.createDraftFile(file)
    }
}

const onRemoveDraft = (draftStringId) => {
    return async (_) => {
        return await agent.http.DRAFT.removeDraft(draftStringId)
    }
}

export default {
    onCreateDraftFile,
    onRemoveDraft
}