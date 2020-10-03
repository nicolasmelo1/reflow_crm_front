import { SET_SELECT_TEMPLATES, SET_SELECT_TEMPLATE_DATA, SET_UPDATE_TEMPLATE_DEPENDS_ON, SET_UPDATE_TEMPLATE_DATA } from '../../types'
import agent from '../../../utils/agent'

const onGetTemplates = (source, groupName, page, filter) => {
    return async (dispatch) => {
        const response = await agent.http.TEMPLATES.getSelectTemplates(source, groupName, page, filter)
        if (response && response.status === 200) {
            const payload = {
                filter: filter,
                page: page,
                data: response.data.data
            }
            dispatch({ type: SET_SELECT_TEMPLATES, payload: payload })
        }
    }
}

const onGetTemplate = (source, templateId) => {
    return async (dispatch) => {
        const response = await agent.http.TEMPLATES.getSelectTemplate(source, templateId)
        if (response && response.status === 200) {
            const payload = {
                id: response.data.data.id,
                display_name: response.data.data.display_name,
                description: response.data.data.description,
                theme_form: response.data.data.theme_form
            }
            dispatch({ type: SET_SELECT_TEMPLATE_DATA, payload: payload })
        }
    }
}

const onGetTemplateFormulary = (source, templateId, templateFormularyId) => {
    return async (_) => {
        let data = {}
        const response = await agent.http.TEMPLATES.getSelectTemplateFormulary(source, templateId, templateFormularyId)
        if (response && response.status === 200) {
            data = {
                ...response.data.data,
                depends_on_form: response.data.data.depends_on_theme_form.map(sectionForm => ({
                    ...sectionForm,
                    form_fields: sectionForm.theme_form_fields.map(formField => ({
                        ...formField,
                        field_option: formField.theme_field_option
                    }))
                }))
            }
            delete data.depends_on_theme_form
        }
        return data
    }
}

const onSelectTemplate = (templateId) => {
    return (_) => {
        return agent.http.TEMPLATES.useTemplate(templateId)
    }
}

const onGetTemplatesSettings = (source) => {
    return async (dispatch) => {
        const response = await agent.http.TEMPLATES.getTemplateSettings(source)
        if (response && response.status === 200) {
            const payload = {
                pagination: response.data.pagination,
                data: response.data.data
            }
            dispatch({ type: SET_UPDATE_TEMPLATE_DATA, payload: payload})
        }
    }
}

const onGetTempalatesDependsOnSettings = (source) => {
    return async (_) => {
        return await agent.http.TEMPLATES.getTemplateDependsOnSettings(source)
    }
}

const onGetTemplatesFormulariesOptionsSettings = (source) => {
    return async (_) => {
        return await agent.http.TEMPLATES.getTemplateFormulariesOptions(source)
    
    }
}

const onChangeTemplateSettingsStateData = (data) => {
    return (dispatch) => {
        dispatch({ type: SET_UPDATE_TEMPLATE_DATA, payload: data})
    }
}

export default {
    onSelectTemplate,
    onGetTemplateFormulary,
    onGetTemplates,
    onGetTemplate,
    onGetTemplatesSettings, 
    onGetTempalatesDependsOnSettings,
    onGetTemplatesFormulariesOptionsSettings,
    onChangeTemplateSettingsStateData
}