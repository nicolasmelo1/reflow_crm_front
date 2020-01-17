import { 
    GET_FORMS,
    UPDATE_GROUP_NAME,
    ERROR 
} from 'redux/types';
import agent from 'redux/agent'


const onGetForms = () => {
    return async (dispatch) => {
        let response = await agent.HOME.getForms()
        dispatch({type: (response.status === 200) ? GET_FORMS : ERROR, payload: response.data});
    };
};

const updateGroupName = (newName) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_GROUP_NAME, payload: newName
        })
    }
}

export default {
    onGetForms,
    updateGroupName
};