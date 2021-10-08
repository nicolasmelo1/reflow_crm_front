import requests from '../requests'
import { companyId } from '../utils'


const DOCUMENTATION = {
    getlastValuesOfFormulary: async (source, formName) => {
        return await requests.get(`data/${companyId}/${formName}/api_configuration/last_values/`, {}, {}, source)
    }
}

export default DOCUMENTATION