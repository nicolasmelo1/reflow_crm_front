import requests from '../requests'
import { companyId } from '../utils'

const DASHBOARD = {
    getDashboardSettingsData: async (source, formName) => {
        return await requests.get(`dashboard/${companyId}/${formName}/settings/`, {}, {}, source)
    }
}

export default DASHBOARD