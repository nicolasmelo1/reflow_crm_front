import agent from '../../utils/agent'

const onCreateUserAndCompany = (body) => {
    return (_) => {
        return agent.http.ONBOARDING.createUserAndCompany(body)
    }
}

const onBulkCreateFormulary = (body) => {
    return (_) => {
        return agent.http.ONBOARDING.bulkCreateFormulary(body)
    }
}

export default {
    onCreateUserAndCompany,
    onBulkCreateFormulary
}