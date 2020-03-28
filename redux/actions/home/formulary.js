import { GET_FORMULARY, SET_FORMULARY_DATA, SET_FORMULARY_OPEN, SET_FORMULARY_SETTINGS_DATA } from 'redux/types';
import agent from 'redux/agent'


const onGetBuildFormulary = (formName) => {
    return async (dispatch) => {
        let response = await agent.HOME.getBuildFormulary(formName)
        dispatch({type: GET_FORMULARY, payload: response.data.data});
    }
}

const onGetFormularyData = (formName, formId, defaults=[]) => {
    return async (dispatch) => {
        let response = await agent.HOME.getFormularyData(formName, formId)
        if (response.status === 200){
            let data = response.data.data
            defaults.forEach(defaultData => {
                const formValueId = defaultData.form_value_id
                const sectionFormValuesIds = data.depends_on_dynamic_form.map(data=> data.dynamic_form_value.map(formValue => formValue.id))
                const sectionIndex = sectionFormValuesIds.findIndex(section=> section.includes(formValueId.toString()))
                if (sectionIndex !== -1) {
                    const formValueIndex = sectionFormValuesIds[sectionIndex].findIndex(formValue => formValue === formValueId.toString())
                    if (formValueIndex !== -1) {
                        data.depends_on_dynamic_form[sectionIndex].dynamic_form_value[formValueIndex].value = defaultData.new_value
                    }    
                }
            })
            dispatch({ type: SET_FORMULARY_DATA, payload: response.data.data})
        }
    }
}

const onFullResetFormularyState = (formFilledData={}, formBuildData={}) => {
    return (dispatch) => {
        dispatch({ type: SET_FORMULARY_DATA, payload: formFilledData })
        dispatch({ type: GET_FORMULARY, payload: formBuildData })
        dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: {} })
    }
}

const onChangeFormularyDataState = (formData) => {
    return (dispatch) => {
        dispatch({ type: SET_FORMULARY_DATA, payload: formData })
    }
}

const onChangeFormularySettingsState = (formSettingsData) => {
    return (dispatch) => {
        dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: formSettingsData })
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

const onGetFormularySettings = (formularyId) => {
    return async (dispatch) => {
        const response = await agent.HOME.getFormularySettingsData(formularyId)
        dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: response.data.data })
    }
}

// We use this to lock the user for sending too many post requests, we wait for the function to finish to send again
const onCreateFormularySettingsSection = (body, formId, sectionIndex) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.formulary.update
        if (body.id !== -1) {
            agent.HOME.createFormularySettingsSection(body, formId).then(response=> {
                if (response.status ===200){
                    stateData.depends_on_form[sectionIndex] = response.data.data
                } else {
                    stateData.depends_on_form[sectionIndex].id = null
                }
                dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: stateData })
            })
        } 
        if (body.id === null) {
            stateData.depends_on_form[sectionIndex].id = -1
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

const onCreateFormularySettingsField = (body, formId, sectionIndex, fieldIndex) => {
    return (dispatch, getState) => {
        let stateData = getState().home.formulary.update
        if (body.id !== -1) {
            agent.HOME.createFormularySettingsField(body, formId).then(response=> {
                if(response.status === 200) {
                    stateData.depends_on_form[sectionIndex].form_fields[fieldIndex] = response.data.data
                } else {
                    stateData.depends_on_form[sectionIndex].form_fields[fieldIndex].id = null
                }
                dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: stateData })
            })
        } 
        if (body.id === null) {
            stateData.depends_on_form[sectionIndex].form_fields[fieldIndex].id = -1
            dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: stateData })
        }
    }
}

const onUpdateFormularySettingsField = (body, formId, fieldId) => {
    return (_) => {
        agent.HOME.updateFormularySettingsField(body, formId, fieldId)
    }
}

const onRemoveFormularySettingsField = (formId, fieldId) => {
    return (_) => {
        agent.HOME.removeFormularySettingsField(formId, fieldId)
    }
}


export default {
    onChangeFormularySettingsState,
    onChangeFormularyDataState,
    onFullResetFormularyState,
    onGetFormularySettings,
    onGetBuildFormulary,
    onGetFormularyData,
    onCreateFormularyData,
    onUpdateFormularyData,
    onCreateFormularySettingsSection,
    onUpdateFormularySettingsSection,
    onRemoveFormularySettingsSection,
    onCreateFormularySettingsField,
    onUpdateFormularySettingsField,
    onRemoveFormularySettingsField
}