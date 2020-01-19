import { 
    GET_FORMS,
    UPDATE_GROUPS,
    ERROR 
} from 'redux/types';
import agent from 'redux/agent'


const onGetForms = () => {
    return async (dispatch) => {
        let response = await agent.HOME.getForms()
        dispatch({type: (response.status === 200) ? GET_FORMS : ERROR, payload: response.data});
    };
};

const onGetUpdateForms = () => {
    return async (dispatch) => {
        let response = await agent.HOME.getUpdateForms()
        dispatch({ type: UPDATE_GROUPS, payload: response.data.data })
    }
}

const onCreateOrUpdateGroup = (body, index) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.sidebar.update
        agent.HOME.updateGroup(body, body.id)
        stateData[index] = body
        dispatch({ type: UPDATE_GROUPS, payload: stateData })
    }
} 

const onReorderGroup = (movedGroup, movedIndex, targetGroup, targetIndex) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.sidebar.update

        stateData[targetIndex] = movedGroup
        stateData[movedIndex] = targetGroup
        
        //recount order
        stateData.map((group, index) => {
            group.order = index
            if ([movedGroup.id, targetGroup.id].includes(group.id)) {
                agent.HOME.updateGroup(group, group.id)
            }
        });

        dispatch({ type: UPDATE_GROUPS, payload: stateData })
    }
}

const onCreateOrUpdateForm = (body, groupIndex, index) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.sidebar.update
        stateData[groupIndex].form_group[index] = body
        agent.HOME.updateForm(body, body.group, body.id)
        dispatch({ type: UPDATE_GROUPS, payload: stateData })
    }
}


export default {
    onGetForms,
    onGetUpdateForms,
    onCreateOrUpdateGroup,
    onReorderGroup,
    onCreateOrUpdateForm
};