import { OPEN_FORMULARY, GET_FORMULARY, SET_FORMULARY_DATA, SET_FORMULARY_FILES, SET_FORMULARY_SETTINGS_DATA } from 'redux/types';

let initialState = {
    isOpen: false,
    buildData: {},
    filled: {
        data: {},
        files: []
    },
    update: {}
}

export default (state=initialState, action) => {
    switch (action.type) {
        case OPEN_FORMULARY:
            return {
                ...state,
                isOpen: action.payload
            }
        case GET_FORMULARY:
            return {
                ...state,
                buildData: action.payload
            }
        case SET_FORMULARY_DATA:
            return {
                ...state,
                filled: {
                    ...state.filled,
                    data: (action.payload) ? action.payload : initialState.filled.data
                }
            }
        case SET_FORMULARY_FILES:
            return {
                ...state,
                filled: {
                    ...state.filled,
                    files: (action.payload) ? action.payload : initialState.filled.files
                }
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