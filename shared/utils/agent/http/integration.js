import requests from '../requests'

const INTEGRATION = {
    createIntegration: async (serviceName, body) => {
        return await requests.post(`integration/${serviceName}/`, body)
    }
}

export default INTEGRATION