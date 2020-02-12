import { GET_FORMULARY, SET_FORMULARY_DATA } from 'redux/types';

let initialState = {
    loaded: {},
    filled_data: {},
    update: {}
}

export default (state=initialState, action) => {
    switch (action.type) {
        case GET_FORMULARY:
            return {
                ...state,
                loaded: action.payload.data
            }
        case SET_FORMULARY_DATA:
            return {
                ...state,
                filled_data: (action.payload) ? action.payload : initialState.filled_data
            }
        default:
            return state;
    }
};