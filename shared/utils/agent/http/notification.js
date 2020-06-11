import requests from '../requests'
import { companyId } from '../utils'


const NOTIFICATION = {
    getNewNotifications: async () => {
        return await requests.get(`notification/${companyId}/read/`, {}, {}, {})
    },
    getNotification: async (source, params) => {
        return await requests.get(`notification/${companyId}/`, params, {}, source)
    },
    readNotification: async (body) => {
        return await requests.post(`notification/${companyId}/read/`, body, {}, {})
    },
    getNotificationConfiguration: async (source, params) => {
        return await requests.get(`notification/${companyId}/settings/`, params, {}, source)
    },
    getNotificationConfigurationFields: async (source, formId) => {
        return await requests.get(`notification/${companyId}/settings/get_fields/${formId}/`, {}, {}, source)
    },
    updateNotificationConfiguration: async (body, notificationConfigurationId) => {
        return await requests.put(`notification/${companyId}/settings/${notificationConfigurationId}/`, body, {}, {})
    },
    createNotificationConfiguration: async (body) => {
        return await requests.post(`notification/${companyId}/settings/`, body, {}, {})
    },
    removeNotificationConfiguration: async (notificationConfigurationId) => {
        return await requests.delete(`notification/${companyId}/settings/${notificationConfigurationId}/`, {}, {}, {})
    }
}

export default NOTIFICATION