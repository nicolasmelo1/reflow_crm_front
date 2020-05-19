import agent from '../../utils/agent'

const onCreateUserAndCompany = (body) => {
    return (_) => {
        return agent.http.ONBOARDING.createUserAndCompany(body)
    }
}

export default {
    onCreateUserAndCompany
};