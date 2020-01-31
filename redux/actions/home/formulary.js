import { GET_FORMULARY, SET_FORMULARY_DATA } from 'redux/types';
import agent from 'redux/agent'

const onGetFormulary = (formName) => {
    return async (dispatch) => {
        let response = await agent.HOME.getFormulary(formName)
        dispatch({type: (response.status === 200) ? GET_FORMULARY : ERROR, payload: response.data});
    };
};

const onChangeFormularyData = (formData) => {
    return (dispatch) => 
    dispatch({ type: SET_FORMULARY_DATA, payload: formData})
}


export default {
    onGetFormulary
}