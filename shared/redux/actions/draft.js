import agent from '../../utils/agent'
 
const onCreateDraft = (file) => {
    return async (_) => {
        return await agent.http.DRAFT.createDraft(file)
    }
}

export default {
    onCreateDraft
}