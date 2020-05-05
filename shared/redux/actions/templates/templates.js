import { SET_TEMPLATES } from '../../types'
import agent from '../../agent'

const onGetTemplates = (source, groupName, page, filter) => {
    return async (dispatch) => {
        const response = await agent.TEMPLATES.getTemplates(source, groupName, page, filter)
        if (response && response.status === 200) {
            const payload = {
                filter: filter,
                page: page,
                data: response.data.data
            }
            dispatch({ type: SET_TEMPLATES, payload: payload })
        }
    }
}

export default {
    onGetTemplates
}