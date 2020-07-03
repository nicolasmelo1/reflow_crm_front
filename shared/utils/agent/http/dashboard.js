import requests from '../requests'
import { companyId } from '../utils'

const DASHBOARD = {
    getDashboardCharts: async (source, formName) => {
        return await requests.get(`dashboard/${companyId}/${formName}/`, {}, {}, source)
    },
    getDashboardSettingsData: async (source, formName) => {
        return await requests.get(`dashboard/${companyId}/${formName}/settings/`, {}, {}, source)
    },
    getDashboardSettingsFieldsOptions: async (source, formName) => {
        return await requests.get(`dashboard/${companyId}/${formName}/settings/field_options/`, {}, {}, source)
    },
    createDashboardSettings: async (body, formName) => {
        return await requests.post(`dashboard/${companyId}/${formName}/settings/`, body)
    },
    updateDashboardSettings: async (body, formName, dashboardConfigurationId) => {
        return await requests.put(`dashboard/${companyId}/${formName}/settings/${dashboardConfigurationId}/`, body)
    },
    removeDashboardSettings: async (formName, dashboardConfigurationId) => {
        return await requests.delete(`dashboard/${companyId}/${formName}/settings/${dashboardConfigurationId}/`, {}, {})
    }
}

export default DASHBOARD