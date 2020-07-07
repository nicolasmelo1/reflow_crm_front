import { SET_DASHBOARD_CHARTS } from '../../types';
import agent from '../../../utils/agent'

const getAndDispatchDashboardCharts = (dispatch, source, formName, params) => {
    agent.http.DASHBOARD.getDashboardCharts(source, formName).then(async response=> {
        if (response && response.status === 200) {
            let payload = response.data.data
            const promises = payload.map(async (chart, index) => {
                const response = await agent.http.DASHBOARD.getDashboardChartData(source, formName, chart.id)
                if (response && response.status === 200) {
                    payload[index].data = response.data.data
                }
            })
            await Promise.all(promises)
            dispatch({ type: SET_DASHBOARD_CHARTS, payload: payload})
        }
    })
}

const onGetDashboardCharts = (source, formName, params) => {
    return (dispatch, getState) => {
        getAndDispatchDashboardCharts(dispatch, source, formName, params)
        agent.websocket.DASHBOARD.recieveDataUpdated({
            formName: formName,
            callback: (data) => {
                const filterParams = getState().home.filter
                const params = {
                    search_field: filterParams.search_field,
                    search_value: filterParams.search_value,
                    search_exact: filterParams.search_exact
                }
                getAndDispatchDashboardCharts(dispatch, source, formName, params)
            }
        })
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