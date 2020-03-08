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
        dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: {} })
    }
}


const onCreateFormularyData = (body, formName) => {
    return async (dispatch) => {
        const response = await agent.HOME.createFormularyData(body, formName)
        if (response.status === 200) {
            dispatch({ type: SET_FORMULARY_DATA, payload: {} })
        }
        return response
    }
}


const onUpdateFormularyData = (body, formName, formId) => {
    return async (dispatch) => {
        const response = await agent.HOME.updateFormularyData(body, formName, formId)
        if (response.status === 200) {
            dispatch({ type: SET_FORMULARY_DATA, payload: {} })
        }
        return response
    }
}

const onChangeFormularyData = (formData) => {
    return (dispatch) => {
        dispatch({ type: SET_FORMULARY_DATA, payload: formData })
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

const onCreateFormularySettingsSection = (body, formId, sectionIndex) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.formulary.update
        const response = await agent.HOME.createFormularySettingsSection(body, formId)
        if (response.status === 200){ 
            stateData.depends_on_form[sectionIndex] = response.data.data
            dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: stateData })
        }
    }
}

const onUpdateFormularySettingsSection = (body, formId, sectionId) => {
    return (_) => {
        agent.HOME.updateFormularySettingsSection(body, formId, sectionId)
    }
}

const onRemoveFormularySettingsSection = (formId, sectionId) => {
    return (_) => {
        agent.HOME.removeFormularySettingsSection(formId, sectionId)
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
    onUpdateFormularyData,
    onCreateFormularySettingsSection,
    onUpdateFormularySettingsSection,
    onRemoveFormularySettingsSection
}