import agent from '../../utils/agent'
 
const onCreateDraftFile = (source, file) => {
    return async (_) => {
        return await agent.http.DRAFT.createDraftFile(source, file)
    }
}

const onDuplicateDraft = (draftStringId) => {
    return async (_) => {
        return await agent.http.DRAFT.duplicateDraft(draftStringId)
    }
}

const onRemoveDraft = (draftStringId) => {
    return async (_) => {
        return await agent.http.DRAFT.removeDraft(draftStringId)
    }
}

export default {
    onCreateDraftFile,
    onDuplicateDraft,
    onRemoveDraft
}