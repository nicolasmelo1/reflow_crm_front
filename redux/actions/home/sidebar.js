import { 
    GET_FORMS,
    UPDATE_GROUPS,
    ERROR 
} from 'redux/types';
import agent from 'redux/agent'
import { initStore } from 'redux/store';


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

const onCreateOrUpdateGroup = (body) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.sidebar.update
        for (let i=0; i<stateData.length; i++) {
            if (stateData[i].id === body.id) {
                agent.HOME.updateGroup(body, body.id)
                stateData[i] = body
                break
            } 
        }
        dispatch({ type: UPDATE_GROUPS, payload: stateData })
    }
} 

const onReorderGroup = (movedGroup, targetGroup) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.sidebar.update

        let movedIndex = null;
        let targetIndex = null;

        for (let i=0; i<stateData.length; i++){
            if (stateData[i].order === movedGroup.order){
                movedIndex = i
            }
            if (stateData[i].order === targetGroup.order){
                targetIndex = i
            }
        }

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

const onCreateOrUpdateForm = (body) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.sidebar.update

        let group = null
        let groupIndex = null
        //get group
        for (let i=0; i<stateData.length; i++) {
            if (stateData[i].id === body.group) {
                group = stateData[i]
                groupIndex = i
                break
            } 
        }
        
        //get and update form
        for (let i=0; i<group.form_group.length; i++) {
            if (group.form_group[i].id === body.id) {
                stateData[groupIndex].form_group[i] = body
                agent.HOME.updateForm(body, body.group, body.id)
            } 
        }
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