import requests from '../requests'

const LOGIN = {
    makeLogin: async (body) => {
        return await requests.post('login/', body)
    },
    testToken: async () => {
        return await requests.get('login/test_token/')
    },
    getDataTypes: async () => {
        return await requests.get('types/')
    },
    registerPushNotification: async (body) => {
        return await requests.post('login/push_notification/', body)
    }
}

export default LOGIN
