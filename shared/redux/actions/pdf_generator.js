import { 
    SET_PDF_GENERATOR_CREATOR_TEMPLATES, 
    SET_PDF_GENERATOR_READER_TEMPLATES,
    SET_PDF_GENERATOR_ALLOWED_BLOCKS
} from '../types'
import agent from '../../utils/agent'

const onGetAllowedBlocks = (source) => {
    return async (dispatch) => {
        const response = await agent.http.PDF_GENERATOR.getAllowedBlocks(source)
        if (response && response.status === 200) {
            dispatch({ type: SET_PDF_GENERATOR_ALLOWED_BLOCKS, payload: response.data.data })
        }
    }
}

const onGetPDFGeneratorTemplatesConfiguration = (source, formName, page) => {
    return async (dispatch, getState) => {
        let templates = getState().pdf_generator.creator.templates
        const response = await agent.http.PDF_GENERATOR.getTemplatesSettings(source, formName, page)
        if (response && response.status === 200) {
            const payload = page === 1 ? response.data.data : templates.concat(response.data.data)
            dispatch({ type: SET_PDF_GENERATOR_CREATOR_TEMPLATES, payload: payload })
        }
        return response
    }
}

const onGetPDFGeneratorTemplateConfiguration = (source, formName, pdfTemplateConfigurationId) => {
    return (_) => {
        return agent.http.PDF_GENERATOR.getTemplateSettings(source, formName, pdfTemplateConfigurationId) 
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

const onRemovePDFGeneratorTemplateConfiguration = (formName, pdfTemplateConfigurationId) => {
    return async(_) => {
        return await agent.http.PDF_GENERATOR.removeTemplate(formName, pdfTemplateConfigurationId)
    }    
}

const onGetPDFGeneratorTempalatesConfigurationFieldOptions = (source, formName) => {
    return async (_) => {
        return await agent.http.PDF_GENERATOR.getFieldOptions(source, formName)
    }
}

const onGetPDFGeneratorTempalatesReader = (source, formName, page) => {
    return async (dispatch, getState) => {
        let templates = getState().pdf_generator.reader.templates
        const response = await agent.http.PDF_GENERATOR.getTemplates(source, formName, page)
        if (response && response.status === 200) {
            const payload = page === 1 ? response.data.data : templates.concat(response.data.data)
            dispatch({ type: SET_PDF_GENERATOR_READER_TEMPLATES, payload: payload })
        }
        return response
    }
}

const onGetPDFGeneratorTempalateReader = (source, formName, pdfTemplateConfigurationId) => {
    return (_) => {
        return agent.http.PDF_GENERATOR.getPDFTemplate(source, formName, pdfTemplateConfigurationId)
    }
}

const onGetPDFGeneratorValuesReader = (source, formName, pdfTemplateConfigurationId, formId) => {
    return async (_) => {
        return await agent.http.PDF_GENERATOR.getValueOptions(source, formName, pdfTemplateConfigurationId, formId)
    }
}

const onCheckIfCanDownloadPDF = (source, formName, pdfTemplateConfigurationId) => {
    return async (_) => {
        return await agent.http.PDF_GENERATOR.canDownloadPDF(source, formName, pdfTemplateConfigurationId)
    }
}

export default {
    onGetAllowedBlocks,
    onGetPDFGeneratorTempalateReader,
    onGetPDFGeneratorTempalatesReader,
    onGetPDFGeneratorValuesReader,
    onGetPDFGeneratorTemplateConfiguration,
    onGetPDFGeneratorTemplatesConfiguration,
    onCreatePDFGeneratorTemplateConfiguration,
    onUpdatePDFGeneratorTemplateConfiguration,
    onRemovePDFGeneratorTemplateConfiguration,
    onChangePDFGeneratorTemplatesConfigurationState,
    onGetPDFGeneratorTempalatesConfigurationFieldOptions,
    onCheckIfCanDownloadPDF
}