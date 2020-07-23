import { SET_TYPES } from '../types';



const initialState = {
    types: {}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_TYPES:
            return { 
                ...state,
                types: action.payload
            }
            default:
                return state
    }
}