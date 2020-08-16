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
    return (dispatch) => {
        return agent.http.USERS.getUsersConfiguration(source).then(response => {
            if (response && response.status === 200) {
                dispatch({ type: SET_USER_UPDATE_DATA, payload: response.data.data })
            }
        })
    }
}

const onChangeUsersConfiguration = (data) => {
    return (dispatch) => {
        dispatch({ type: SET_USER_UPDATE_DATA, payload: data })
    }
}


export default {
    onGetFormularyAndFieldOptions,
    onGetUsersConfiguration,
    onChangeUsersConfiguration
}