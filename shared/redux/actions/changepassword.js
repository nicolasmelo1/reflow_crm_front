import agent from '../../utils/agent'

const onUpdateUserPassword = (body) => {
    return (_) => {
        return agent.http.CHANGE_PASSWORD.updateUserPassword(body)
    }
}

export default {
    onUpdateUserPassword
};