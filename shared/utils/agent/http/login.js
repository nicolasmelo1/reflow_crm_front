import requests from '../requests'

const LOGIN = {
    forgotPassword: async (body) => {
        return await requests.post('authentication/forgot/', body)
    },
    makeLogin: async (body) => {
        return await requests.post('authentication/login/', body)
    },
    testToken: async () => {
        return await requests.get('authentication/test_token/')
    },
    getDataTypes: async () => {
        return await requests.get('core/types/')
    },
    registerPushNotification: async (body) => {
        return await requests.post('notify/push_notification/', body)
    }
}

export default LOGIN
