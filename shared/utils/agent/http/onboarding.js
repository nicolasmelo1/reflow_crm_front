import requests from '../requests'

const ONBOARDING = {
    createUserAndCompany: async (body) => {
        return await requests.post('login/onboarding/', body)
    }
}

export default ONBOARDING
 