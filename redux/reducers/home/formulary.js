import { GET_FORMULARY, SET_FORMULARY_DATA, SET_FORMULARY_FILES, SET_FORMULARY_SETTINGS_DATA } from 'redux/types';

let initialState = {
    buildData: {},
    filled: {
        data: {},
        files: []
    },
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