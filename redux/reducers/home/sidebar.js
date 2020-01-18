import { GET_FORMS, GET_UPDATE_FORMS, UPDATE_GROUP } from 'redux/types';

let initialState = {
    initial: [],
    update: []
}

export default (state=initialState, action) => {
    switch (action.type) {
        case GET_FORMS:
            return {
                ...state,
                initial: action.payload.data
            }
        case GET_UPDATE_FORMS:
            return {
                ...state,
                update: action.payload.data
            }
        case UPDATE_GROUP:
            let data = state.update
            for (let i=0; i<data.length; i++) {
                if (data[i].id === action.payload.id) {
                    data[i] = action.payload
                    break
                }
            }
            return {
                ...state,
                update: data
            }
        default:
            return state;
    }
};