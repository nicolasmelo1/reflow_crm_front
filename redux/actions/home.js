import { GET_FORMS, ERROR } from '../types';
import agent from '../agent'


const onGetForms = () => {
    return async (dispatch) => {
        let response = await agent.HOME.getForms()
        dispatch({type: (response.status === 200) ? GET_FORMS : ERROR, payload: response.data});
    };
};

export default {
    onGetForms
};