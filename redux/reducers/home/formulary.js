import { GET_FORMULARY, SET_FORMULARY_DATA } from 'redux/types';

let initialState = {
    loaded: {
        depends_on_form: []
    },
    filled_data: {
        depends_on_form: []
    },
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
                filled_data: action.payload
            }
        default:
            return state;
    }
};