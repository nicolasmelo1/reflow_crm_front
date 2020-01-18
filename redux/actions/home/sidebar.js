import { 
    GET_FORMS,
    GET_UPDATE_FORMS,
    UPDATE_GROUP,
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
        dispatch({ type: GET_UPDATE_FORMS, payload: response.data })
    }
}

const onCreateOrUpdateGroup = (body) => {
    return async (dispatch) => {
        if (body.id && body.id !== ''){
            agent.HOME.updateGroup(body, body.id)
        }
        dispatch({ type: UPDATE_GROUP, payload: body })
    }
} 

export default {
    onGetForms,
    onGetUpdateForms,
    onCreateOrUpdateGroup
};