import requests from "../requests"
import { companyId } from '../utils'


const AUTOMATION = {
    settingsLoadApps: async (source) => {
        return await requests.get(`automation/${companyId}/settings/`, {}, {}, source)
    },
    settingsGetInputFormulary: async (source, inputFormularyId) => {
        return await requests.get(`automation/${companyId}/settings/input_formulary/${inputFormularyId}/`, {}, {}, source)
    }
}

export default AUTOMATION