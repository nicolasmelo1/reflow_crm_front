import { GET_FORMULARY } from 'redux/types';
import agent from 'redux/agent'

const onGetFormulary = (formName) => {
    return async (dispatch) => {
        let response = await agent.HOME.getFormulary(formName)
        dispatch({type: (response.status === 200) ? GET_FORMULARY : ERROR, payload: response.data});
    };
};


export default {
    onGetFormulary
}