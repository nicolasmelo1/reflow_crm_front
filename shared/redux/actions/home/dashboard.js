import agent from '../../../utils/agent'

const onGetDashboardSettings = (source, formName) => {
    return (_) => {
        return agent.http.DASHBOARD.getDashboardSettingsData(source, formName)
    }
}

export default {
    onGetDashboardSettings
}