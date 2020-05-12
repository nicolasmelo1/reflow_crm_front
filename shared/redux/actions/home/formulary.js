import { OPEN_FORMULARY, GET_FORMULARY, SET_FORMULARY_DATA, SET_FORMULARY_FILES, SET_FORMULARY_SETTINGS_DATA } from '../../types';
import agent from '../../../utils/agent'
import delay from '../../../utils/delay'


const makeDelay = delay(1000)

const onOpenFormulary = (isOpen) => {
    return async (dispatch) => {
        dispatch({type: OPEN_FORMULARY, payload: isOpen })
        return isOpen
    }
}

const onGetBuildFormulary = (source, formName) => {
    return async (dispatch) => {
        let data = {}
        let response = await agent.http.FORMULARY.getBuildFormulary(source, formName)
        if (response && response.status === 200) {
            data = response.data.data
            //dispatch({type: GET_FORMULARY, payload: data})
        }
        return data
    }
}

const onGetFormularyData = (source, formName, formId, defaults=[]) => {
    return async (dispatch) => {
        let data = {}
        const response = await agent.http.FORMULARY.getFormularyData(source, formName, formId)
        if (response && response.status === 200){
            data = response.data.data
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
            dispatch({ type: SET_FORMULARY_DATA, payload: data})
        }
        return data
    }
}

const onFullResetFormularyState = (formFilledData={}, formFilledFiles=[], formBuildData={}) => {
    return (dispatch) => {
        dispatch({ type: SET_FORMULARY_DATA, payload: formFilledData })
        dispatch({ type: SET_FORMULARY_FILES, payload: formFilledFiles })
        dispatch({ type: GET_FORMULARY, payload: formBuildData })
        dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: {} })
    }
}

const onChangeFormularyDataState = (formData) => {
    return (dispatch) => {
        dispatch({ type: SET_FORMULARY_DATA, payload: formData })
    }
}

const onChangeFormularyFilesState = (files) => {
    return (dispatch) => {
        dispatch({ type: SET_FORMULARY_FILES, payload: files })
    }
}

const onCreateFormularyData = (body, files, formName) => {
    return async (dispatch) => {
        try {
            const response = await agent.http.FORMULARY.createFormularyData(body, files, formName)
            if (response.status === 200) {
                dispatch({ type: SET_FORMULARY_DATA, payload: {} })
                dispatch({ type: SET_FORMULARY_FILES, payload: [] })
            }
            return response
        } catch {}
    }
}


const onUpdateFormularyData = (body, files, formName, formId) => {
    return async (dispatch) => {
        try {
            const response = await agent.http.FORMULARY.updateFormularyData(body, files, formName, formId)
            if (response.status === 200) {
                dispatch({ type: SET_FORMULARY_DATA, payload: {} })
                dispatch({ type: SET_FORMULARY_FILES, payload: [] })
            }
            return response
        } catch {}
    }
}

/*******************
 *                 *
 *     FORMULARY   *
 *     SETTINGS    *
 *                 *
 *******************/

const onChangeFormularySettingsState = (formSettingsData) => {
    return (dispatch) => {
        dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: formSettingsData })
    }
}


const onGetFormularySettings = (source, formularyId) => {
    return async (dispatch) => {
        try {
            const response = await agent.http.FORMULARY.getFormularySettingsData(source, formularyId)
            dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: response.data.data })
            return response
        } catch {}
    }
}

// We use this to lock the user for sending too many post requests, we wait for the function to finish to send again
const onCreateFormularySettingsSection = (body, formId, sectionIndex) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.formulary.update
        if (body.id === null) {
            makeDelay(() => { 
                stateData.depends_on_form[sectionIndex].id = -1
                agent.http.FORMULARY.createFormularySettingsSection(body, formId).then(response=> {
                    if (response && response.status === 200){
                        stateData.depends_on_form[sectionIndex] = response.data.data
                    } else {
                        stateData.depends_on_form[sectionIndex].id = null
                    }
                    dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: stateData })
            
                })
                dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: stateData })
            })
            dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: stateData })
        }
    }
}

const onUpdateFormularySettingsSection = (body, formId, sectionId) => {
    return (_) => {
        agent.http.FORMULARY.updateFormularySettingsSection(body, formId, sectionId)
    }
}

const onRemoveFormularySettingsSection = (formId, sectionId) => {
    return (_) => {
        agent.http.FORMULARY.removeFormularySettingsSection(formId, sectionId)
    }
}

const onCreateFormularySettingsField = (body, formId, sectionIndex, fieldIndex) => {
    return (dispatch, getState) => {
        let stateData = getState().home.formulary.update
        if (body.id === null) {
            makeDelay(() => { 
                stateData.depends_on_form[sectionIndex].form_fields[fieldIndex].id = -1
                agent.http.FORMULARY.createFormularySettingsField(body, formId).then(response=> {
                    if(response.status === 200) {
                        stateData.depends_on_form[sectionIndex].form_fields[fieldIndex] = response.data.data
                    } else {
                        stateData.depends_on_form[sectionIndex].form_fields[fieldIndex].id = null
                    }
                    dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: stateData })
                })
                dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: stateData })
            })
            dispatch({ type: SET_FORMULARY_SETTINGS_DATA, payload: stateData })
        }
    }
}

const onUpdateFormularySettingsField = (body, formId, fieldId) => {
    return (_) => {
        agent.http.FORMULARY.updateFormularySettingsField(body, formId, fieldId)
    }
}

const onRemoveFormularySettingsField = (formId, fieldId) => {
    return (_) => {
        agent.http.FORMULARY.removeFormularySettingsField(formId, fieldId)
    }
}


export default {
    onOpenFormulary,
    onChangeFormularySettingsState,
    onChangeFormularyDataState,
    onChangeFormularyFilesState,
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