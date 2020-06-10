import requests from '../requests'

const CHANGE_PASSWORD = {
    updateUserPassword: async (body) => {
        return await requests.post('authentication/change_password/', body)
    }
}

export default CHANGE_PASSWORD
 