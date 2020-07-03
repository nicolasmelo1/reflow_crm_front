import { SET_DASHBOARD_CHARTS } from '../../types';
import agent from '../../../utils/agent'


const onGetDashboardCharts = (source, formName) => {
    return async (dispatch) => {
        const response = await agent.http.DASHBOARD.getDashboardCharts(source, formName)
        if (response && response.status === 200) {
            return dispatch({ type: SET_DASHBOARD_CHARTS, payload: response.data.data})
        }
        return response
    }
}

const onGetDashboardSettings = (source, formName) => {
    return (_) => {
        return agent.http.DASHBOARD.getDashboardSettingsData(source, formName)
    }
}

const onGetFieldOptions = (source, formName) => {
    return (_) => {
        return agent.http.DASHBOARD.getDashboardSettingsFieldsOptions(source, formName)
    }
}

const onCreateDashboardSettings = (body, formName) => {
    return (_) => {
        return agent.http.DASHBOARD.createDashboardSettings(body, formName)
    }
}

const onUpdateDashboardSettings = (body, formName, dashboardConfigurationId) => {
    return (_) => {
        return agent.http.DASHBOARD.updateDashboardSettings(body, formName, dashboardConfigurationId)
    }
}

const onRemoveDashboardSettings = (formName, dashboardConfigurationId) => {
    return (_) => {
        return agent.http.DASHBOARD.removeDashboardSettings(formName, dashboardConfigurationId)
    }
}

export default {
    onGetDashboardCharts,
    onGetDashboardSettings,
    onGetFieldOptions,
    onCreateDashboardSettings,
    onRemoveDashboardSettings,
    onUpdateDashboardSettings
}