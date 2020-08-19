import { SET_USER_FORMULARIES_AND_FIELD_OPTIONS, SET_USER_UPDATE_DATA } from '../types';
import agent from '../../utils/agent'

const onGetFormularyAndFieldOptions = (source) => {
    return (dispatch) => {
        return agent.http.USERS.getFormularyAndFieldOptions(source).then(response => {
            if (response && response.status === 200) {
                dispatch({ type: SET_USER_FORMULARIES_AND_FIELD_OPTIONS, payload: response.data.data })
            }
        })
    }
}

const onGetUsersConfiguration = (source) => {
    return async (dispatch) => {
        const response = await agent.http.USERS.getUsersConfiguration(source)
        if (response && response.status === 200) {
            dispatch({ type: SET_USER_UPDATE_DATA, payload: response.data.data })
        }
        return response
    }
}

const onChangeUsersConfiguration = (data) => {
    return (dispatch) => {
        dispatch({ type: SET_USER_UPDATE_DATA, payload: data })
    }
}

const onUpdateUsersConfiguration = (body, userId) => {
    return (_) => {
        return agent.http.USERS.updateUsersConfiguration(body, userId)
    }
}

const onCreateUsersConfiguration = (body) => {
    return (_) => {
        return agent.http.USERS.createUsersConfiguration(body)
    }
}

const onRemoveUsersConfiguration = (userId) => {
    return (_) => {
        return agent.http.USERS.removeUsersConfiguration(userId)
    }
}

export default {
    onGetFormularyAndFieldOptions,
    onGetUsersConfiguration,
    onChangeUsersConfiguration,
    onUpdateUsersConfiguration,
    onCreateUsersConfiguration,
    onRemoveUsersConfiguration
}