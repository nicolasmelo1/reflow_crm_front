import { 
    SET_GROUPS,
    UPDATE_GROUPS,
    ERROR 
} from '../../types';
import agent from '../../../utils/agent'


const onGetForms = (source) => {
    return async (dispatch) => {
        let response = await agent.http.SIDEBAR.getForms(source)
        if (response && response.status === 200) {
            dispatch({type: SET_GROUPS, payload: response.data.data })
        }
        return response
    }
}

const onGetUpdateForms = () => {
    return async (dispatch) => {
        let response = await agent.http.SIDEBAR.getUpdateForms()
        if (response && response.status === 200) {
            dispatch({ type: UPDATE_GROUPS, payload: response.data.data })
        }
    }
}

const onChangeGroupState = (groupsData) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_GROUPS, payload: groupsData })
    }
}

const onUpdateGroup = (body) => {
    return async (_) => {
        agent.http.SIDEBAR.updateGroup(body, body.id)
    }
} 

const onRemoveGroup = (groupId) => {
    return async (_) => {
        agent.http.SIDEBAR.removeGroup(groupId)
    }
}

/*********
 *       *
 * FORMS *
 *       *
 *********/
const onCreateFormulary = (body, groupIndex, formIndex) => {
    return (dispatch, getState) => {
        let stateData = getState().home.sidebar.update
        if (body.id !== -1) {
            agent.http.SIDEBAR.createForm(body).then(response=> {
                if(response.status === 200) {
                    stateData[groupIndex].form_group[formIndex] = response.data.data
                } else {
                    stateData[groupIndex].form_group[formIndex].id = null
                }
                dispatch({ type: UPDATE_GROUPS, payload: stateData })
            })
        } 
        if (body.id === null) {
            stateData[groupIndex].form_group[formIndex].id = -1
            dispatch({ type: UPDATE_GROUPS, payload: stateData })
        }
    }
}

const onUpdateFormulary = (body, formId) => {
    return (_) => {
        agent.http.SIDEBAR.updateForm(body, formId)
    }
}

const onRemoveFormulary = (formId) => {
    return (_) => {
        agent.http.SIDEBAR.removeForm(formId)
    }
}

const onAddNewForm = (body, groupIndex) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.sidebar.update

        stateData[groupIndex].form_group.splice(0, 0, body)

        // recount order
        stateData[groupIndex].form_group.map((form, index) => {
            form.order = index
        })

        dispatch({ type: UPDATE_GROUPS, payload: stateData })
    }
}

export default {
    onGetForms,
    onGetUpdateForms,
    onChangeGroupState,
    onUpdateGroup,
    onRemoveGroup,
    onCreateFormulary,
    onUpdateFormulary,
    onRemoveFormulary,
    onAddNewForm
};