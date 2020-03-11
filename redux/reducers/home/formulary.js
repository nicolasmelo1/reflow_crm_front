import { GET_FORMULARY, SET_FORMULARY_DATA, SET_FORMULARY_OPEN, SET_FORMULARY_SETTINGS_DATA } from 'redux/types';

let initialState = {
    buildData: {},
    filledData: {},
    update: {}
}

export default (state=initialState, action) => {
    switch (action.type) {
        case GET_FORMULARY:
            return {
                ...state,
                buildData: action.payload
            }
        case SET_FORMULARY_DATA:
            return {
                ...state,
                filledData: (action.payload) ? action.payload : initialState.filledData
            }
        case SET_FORMULARY_SETTINGS_DATA:
            return {
                ...state,
                update: action.payload
            }
        default:
            return state;
    }
};