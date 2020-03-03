import { GET_FORMULARY, SET_FORMULARY_DATA, SET_FORMULARY_OPEN, SET_FORMULARY_SETTINGS_DATA } from 'redux/types';
import agent from 'redux/agent'


const onOpenOrCloseFormulary = (isOpen=false) => {
    return (dispatch) => {
        dispatch({type: SET_FORMULARY_OPEN, payload: isOpen})
    }
}

const onGetBuildFormulary = (formName) => {
    return async (dispatch) => {
        let response = await agent.HOME.getBuildFormulary(formName)
        dispatch({type: GET_FORMULARY, payload: response.data.data});
    }
}

const onGetFormularyData = (formName, formId) => {
    return async (dispatch) => {
        let response = await agent.HOME.getFormularyData(formName, formId)
        dispatch({ type: SET_FORMULARY_DATA, payload: response.data.data})
    }
}


const onFullResetFormulary = (formFilledData={}, formBuildData={}) => {
    return (dispatch) => {
        dispatch({ type: SET_FORMULARY_DATA, payload: formFilledData })
        dispatch({ type: GET_FORMULARY, payload: formBuildData })
    }
}


const onCreateFormularyData = (body, formName) => {
    return async (dispatch) => {
        const response = await agent.HOME.createFormularyData(body, formName)
        if (response.status === 200) {
            dispatch({ type: SET_FORMULARY_DATA, payload: [] })
        }
        return response
    }
}

const onUpdateFormularyData = (body, formName, formId) => {
    return async (dispatch) => {
        const response = await agent.HOME.updateFormularyData(body, formName, formId)
        if (response.status === 200) {
            dispatch({ type: SET_FORMULARY_DATA, payload: [] })
        }
        return response
    }
}

const onChangeFormularyData = (formData) => {
    return (dispatch) => {
        dispatch({ type: SET_FORMULARY_DATA, payload: formData})
    }
}

const onGetFormularySettings = (formularyId) => {
    return async (dispatch) => {
        const response = await agent.HOME.getFormularySettingsData(formularyId)
        dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: response.data.data })
    }
}

const onUpdateFormularySettings = (formSettingsData) => {
    return (dispatch) => {
        dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: formSettingsData })
    }
}

export default {
    onUpdateFormularySettings,
    onGetFormularySettings,
    onOpenOrCloseFormulary,
    onGetBuildFormulary,
    onChangeFormularyData,
    onGetFormularyData,
    onFullResetFormulary,
    onCreateFormularyData,
    onUpdateFormularyData
}