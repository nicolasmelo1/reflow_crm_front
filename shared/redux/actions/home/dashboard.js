import agent from '../../../utils/agent'

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

export default {
    onGetDashboardSettings,
    onGetFieldOptions,
    onCreateDashboardSettings
}