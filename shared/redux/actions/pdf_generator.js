import { SET_PDF_GENERATOR_FORMULARY_OPTIONS, SET_PDF_GENERATOR_CREATOR_TEMPLATES } from '../types'
import agent from '../../utils/agent'

const onGetPDFGeneratorTemplatesConfiguration = (source, formName) => {
    return async (dispatch) => {
        const response = await agent.http.PDF_GENERATOR.getTemplates(source, formName)
        if (response && response.status === 200) {
            dispatch({ type: SET_PDF_GENERATOR_CREATOR_TEMPLATES, payload: response.data.data })
        }
    }
}

const onChangePDFGeneratorTemplatesConfigurationState = (data) => {
    return (dispatch) => {
        dispatch({ type: SET_PDF_GENERATOR_CREATOR_TEMPLATES, payload: {...data}})
    }
}

const onCreatePDFGeneratorTemplateConfiguration = (data, formName) => {
    return async (_) => {
        return await agent.http.PDF_GENERATOR.createTemplate(data, formName)
    }
}

const onUpdatePDFGeneratorTemplateConfiguration = (data, formName, pdfTemplateConfigurationId) => {
    return async (_) => {
        return await agent.http.PDF_GENERATOR.updateTemplate(data, formName, pdfTemplateConfigurationId)
    }
}

const onGetPDFGeneratorTempalatesConfigurationFieldOptions = (source, formName) => {
    return async (_) => {
        return await agent.http.PDF_GENERATOR.getFieldOptions(source, formName)
    }
}

export default {
    onGetPDFGeneratorTemplatesConfiguration,
    onCreatePDFGeneratorTemplateConfiguration,
    onUpdatePDFGeneratorTemplateConfiguration,
    onChangePDFGeneratorTemplatesConfigurationState,
    onGetPDFGeneratorTempalatesConfigurationFieldOptions
}