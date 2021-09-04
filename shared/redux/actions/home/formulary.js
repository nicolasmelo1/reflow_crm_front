import { OPEN_FORMULARY, SET_FORMULARY_SETTINGS_DATA } from '../../types';
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
    return async (_) => {
        let data = {}
        let response = await agent.http.FORMULARY.getBuildFormulary(source, formName)
        if (response && response.status === 200) {
            data = response.data.data
        }
        return data
    }
}

const onGetFormularyData = (formName, formId, defaults=[]) => {
    return async (_) => {
        let data = {}
        const response = await agent.http.FORMULARY.getFormularyData(formName, formId)
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
        }
        return data
    }
}


const onGetFormularyUserOptions = (source, formName, fieldId) => {
    return (_) => {
        return agent.http.FORMULARY.getFormularyUserOptions(source, formName, fieldId)
    } 
}

const onCreateFormularyData = (body, formName) => {
    return (_) => {
        return agent.http.FORMULARY.createFormularyData(body, formName)
    }
}


const onUpdateFormularyData = (body, formName, formId, duplicate=null) => {
    return (_) => {
        return agent.http.FORMULARY.updateFormularyData(body, formName, formId, duplicate)
    }
}

/*******************
 *                 *
 *     FORMULARY   *
 *     SETTINGS    *
 *                 *
 *******************/

const onGetFormularySettings = (source, formularyId) => {
    return (_) => {
        return agent.http.FORMULARY.getFormularySettingsData(source, formularyId)
    }
}

// We use this to lock the user for sending too many post requests, we wait for the function to finish to send again
const onCreateFormularySettingsSection = (body, formId) => {
    return (_) => {
        return agent.http.FORMULARY.createFormularySettingsSection(body, formId)
    }
}

const onUpdateFormularySettingsSection = (body, formId, sectionId) => {
    return (_) => {
        return agent.http.FORMULARY.updateFormularySettingsSection(body, formId, sectionId)
    }
}

const onRemoveFormularySettingsSection = (formId, sectionId) => {
    return (_) => {
        agent.http.FORMULARY.removeFormularySettingsSection(formId, sectionId)
    }
}

const onCreateFormularySettingsField = (body, formId) => {
    return (_) => {
        return agent.http.FORMULARY.createFormularySettingsField(body, formId)
    }
}

const onUpdateFormularySettingsField = (body, formId, fieldId) => {
    return (_) => {
        return agent.http.FORMULARY.updateFormularySettingsField(body, formId, fieldId)
    }
}

const onRemoveFormularySettingsField = (formId, fieldId) => {
    return (_) => {
        agent.http.FORMULARY.removeFormularySettingsField(formId, fieldId)
    }
}

const onTestFormularySettingsFormulaField = (body, formId) => {
    return (_) => {
        return agent.http.FORMULARY.testFormularyFormulaField(body, formId)
    }
}

const onGetPublicFormulary = (source, formId) => {
    return (_) => {
        return agent.http.FORMULARY.getPublicFormularySettings(source, formId)
    }
}

const onUpdatePublicFormulary = (formId, greetingsText, descriptionText, isToShowSubmitAnotherButton, fieldIds) => {
    return (_) => {
        const body = {
            form_id: formId,
            greetings_message: greetingsText,
            description_message: descriptionText,
            is_to_submit_another_response_button: isToShowSubmitAnotherButton,
            public_access_form_public_access_fields: fieldIds.map(fieldId => ({ field_id: fieldId }))
        }
        return agent.http.FORMULARY.updatePublicFormularySettings(body, formId)
    }
}

export default {
    onOpenFormulary,
    onGetFormularySettings,
    onGetFormularyUserOptions,
    onGetBuildFormulary,
    onGetFormularyData,
    onCreateFormularyData,
    onUpdateFormularyData,
    onCreateFormularySettingsSection,
    onUpdateFormularySettingsSection,
    onRemoveFormularySettingsSection,
    onCreateFormularySettingsField,
    onUpdateFormularySettingsField,
    onRemoveFormularySettingsField,
    onTestFormularySettingsFormulaField,
    onUpdatePublicFormulary,
    onGetPublicFormulary
}