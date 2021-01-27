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

const onGetPDFGeneratorTemplatesConfiguration = (source, formName) => {
    return async (dispatch) => {
        const response = await agent.http.PDF_GENERATOR.getTemplatesSettings(source, formName)
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

const onGetPDFGeneratorTempalatesReader = (source, formName) => {
    return async (dispatch) => {
        const response = await agent.http.PDF_GENERATOR.getTemplates(source, formName)
        if (response && response.status === 200) {
            dispatch({ type: SET_PDF_GENERATOR_READER_TEMPLATES, payload: response.data.data })
        }
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
    onGetPDFGeneratorTempalatesReader,
    onGetPDFGeneratorValuesReader,
    onGetPDFGeneratorTemplatesConfiguration,
    onCreatePDFGeneratorTemplateConfiguration,
    onUpdatePDFGeneratorTemplateConfiguration,
    onRemovePDFGeneratorTemplateConfiguration,
    onChangePDFGeneratorTemplatesConfigurationState,
    onGetPDFGeneratorTempalatesConfigurationFieldOptions,
    onCheckIfCanDownloadPDF
}