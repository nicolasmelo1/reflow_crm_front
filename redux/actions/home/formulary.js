import { GET_FORMULARY, SET_FORMULARY_DATA } from 'redux/types';
import agent from 'redux/agent'

const onGetBuildFormulary = (formName) => {
    return async (dispatch) => {
        let response = await agent.HOME.getBuildFormulary(formName)
        dispatch({type: (response.status === 200) ? GET_FORMULARY : ERROR, payload: response.data});
    };
};

const onGetFormularyData = (formName, formId) => {
    return async (dispatch) => {
        let response = await agent.HOME.getFormularyData(formName, formId)
        dispatch({ type: SET_FORMULARY_DATA, payload: response.data.data})
    }
}

const onCreateFormularyData = (body, formName) => {
    return async (dispatch) => {
       await agent.HOME.createFormularyData(body, formName)
       dispatch({ type: SET_FORMULARY_DATA, payload: []})
    }
}

const onUpdateFormularyData = (body, formName, formId) => {
    return async (dispatch) => {
       await agent.HOME.updateFormularyData(body, formName, formId)
       dispatch({ type: SET_FORMULARY_DATA, payload: []})
    }
}

const onChangeFormularyData = (formData) => {
    return (dispatch) => {
        dispatch({ type: SET_FORMULARY_DATA, payload: formData})
    }
}


export default {
    onGetBuildFormulary,
    onChangeFormularyData,
    onGetFormularyData,
    onCreateFormularyData,
    onUpdateFormularyData
}