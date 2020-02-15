import { GET_FORMULARY, SET_FORMULARY_DATA, SET_FORMULARY_OPEN } from 'redux/types';

let initialState = {
    isOpen: false,
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
        case SET_FORMULARY_OPEN:
            return {
                ...state,
                isOpen: !state.isOpen
            }
        default:
            return state;
    }
};