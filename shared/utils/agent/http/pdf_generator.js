import requests from '../requests'
import { companyId } from '../utils'

const PDF_GENERATOR = {
    getTemplates: async (source, formName) => {
        return await requests.get(`pdf_generator/${companyId}/${formName}/settings/`, {}, {}, source)
    },
    getFieldOptions: async (source, formName) => {
        return await requests.get(`pdf_generator/${companyId}/${formName}/settings/field_options/`, {}, {}, source)
    }
}

export default PDF_GENERATOR
 