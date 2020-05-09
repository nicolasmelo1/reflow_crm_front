import { GET_FORMS, UPDATE_GROUPS } from '../../types'

let initialState = {
    initial: [],
    update: []
}

export default (state=initialState, action) => {
    switch (action.type) {
        case GET_FORMS:
            return {
                ...state,
                initial: action.payload
            }
        case UPDATE_GROUPS:
            return {
                ...state,
                update: action.payload
            }
        default:
            return state;
    }
};
