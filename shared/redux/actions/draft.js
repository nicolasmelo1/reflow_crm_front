import agent from '../../utils/agent'
 
const onCreateDraft = (source, file) => {
    return async (_) => {
        return await agent.http.DRAFT.createDraft(source, file)
    }
}

const onRemoveDraft = (draftStringId) => {
    return async (_) => {
        return await agent.http.DRAFT.removeDraft(draftStringId)
    }
}

export default {
    onCreateDraft,
    onRemoveDraft
}