import { SET_DASHBOARD_CHARTS, SET_DASHBOARD_UPDATE_DATES } from '../../types';
import agent from '../../../utils/agent'
import { jsDateToStringFormat } from '../../../utils/dates'


const getAndDispatchDashboardCharts = (dispatch, source, formName, params) => {
    return agent.http.DASHBOARD.getDashboardCharts(source, formName).then(async response=> {
        if (response && response.status === 200) {
            let payload = response.data.data
            const promises = payload.map(async (chart, index) => {
                const response = await agent.http.DASHBOARD.getDashboardChartData(source, formName, chart.id, params)
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
        agent.websocket.DASHBOARD.recieveDataUpdated({
            formName: formName,
            callback: (data) => {
                const filterParams = getState().home.filter
                const updateDateParams = getState().home.dashboard.updateDates
                const params = {
                    to_date: updateDateParams.endDate,
                    from_date: updateDateParams.startDate,
                    search_field: filterParams.search_field,
                    search_value: filterParams.search_value,
                    search_exact: filterParams.search_exact
                }
                getAndDispatchDashboardCharts(dispatch, source, formName, params)
            }
        })
        return getAndDispatchDashboardCharts(dispatch, source, formName, params)
    }
}

const setDashboardUpdateDate = (dates) => {
    return (dispatch, getState) => {
        const dateFormat = getState().login.dateFormat

        const startDate = (dates[0] !== '') ? jsDateToStringFormat(dates[0], dateFormat.split(' ')[0]) : dates[0]
        const endDate = (dates[1] !== '') ? jsDateToStringFormat(dates[1], dateFormat.split(' ')[0]) : dates[1]
        const payload = {
            startDate: startDate,
            endDate: endDate
        }
        dispatch({ 
            type: SET_DASHBOARD_UPDATE_DATES, 
            payload: payload
        })

        return payload
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
    setDashboardUpdateDate,
    onGetDashboardCharts,
    onGetDashboardSettings,
    onGetFieldOptions,
    onCreateDashboardSettings,
    onRemoveDashboardSettings,
    onUpdateDashboardSettings
}