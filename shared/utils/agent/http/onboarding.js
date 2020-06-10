import requests from '../requests'

const ONBOARDING = {
    createUserAndCompany: async (body) => {
        return await requests.post('authentication/onboarding/', body)
    }
}

export default ONBOARDING
 