import { GET_FORMULARY } from 'redux/types';

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
        default:
            return state;
    }
};