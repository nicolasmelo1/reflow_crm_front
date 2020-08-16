import { SET_USER_FORMULARIES_AND_FIELD_OPTIONS, SET_USER_UPDATE_DATA } from '../types';

const initialState = {
    update: [],
    formulariesAndFieldPermissionsOptions: []
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_FORMULARIES_AND_FIELD_OPTIONS:
            return {
                ...state,
                formulariesAndFieldPermissionsOptions: action.payload
            }
        case SET_USER_UPDATE_DATA:
            return {
                ...state,
                update: action.payload
            }
        default:
            return state;
    }
}

export default userReducer