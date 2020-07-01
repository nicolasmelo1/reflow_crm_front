import requests from '../requests'
import { companyId } from '../utils'

const DASHBOARD = {
    getDashboardSettingsData: async (source, formName) => {
        return await requests.get(`dashboard/${companyId}/${formName}/settings/`, {}, {}, source)
    },
    getDashboardSettingsFieldsOptions: async (source, formName) => {
        return await requests.get(`dashboard/${companyId}/${formName}/settings/field_options/`, {}, {}, source)
    },
    createDashboardSettings: async (body, formName) => {
        return await requests.post(`dashboard/${companyId}/${formName}/settings/`, body)
    }
}

export default DASHBOARD