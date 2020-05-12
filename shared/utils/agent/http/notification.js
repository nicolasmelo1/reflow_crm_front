import requests from '../requests'
import { companyId } from '../utils'


const NOTIFICATION = {
    getNewNotifications: async () => {
        return await requests.get(`${companyId}/notification/api/read/`, {}, {}, {})
    },
    getNotification: async (source, params) => {
        return await requests.get(`${companyId}/notification/api/`, params, {}, source)
    },
    readNotification: async (body) => {
        return await requests.post(`${companyId}/notification/api/read/`, body, {}, {})
    },
    getNotificationConfiguration: async (source, params) => {
        return await requests.get(`${companyId}/notification/api/settings/`, params, {}, source)
    },
    getNotificationConfigurationFields: async (source, formId) => {
        return await requests.get(`${companyId}/notification/api/settings/get_fields/${formId}/`, {}, {}, source)
    },
    updateNotificationConfiguration: async (body, notificationConfigurationId) => {
        return await requests.put(`${companyId}/notification/api/settings/${notificationConfigurationId}/`, body, {}, {})
    },
    createNotificationConfiguration: async (body) => {
        return await requests.post(`${companyId}/notification/api/settings/`, body, {}, {})
    },
    removeNotificationConfiguration: async (notificationConfigurationId) => {
        return await requests.delete(`${companyId}/notification/api/settings/${notificationConfigurationId}/`, {}, {}, {})
    }
}

export default NOTIFICATION