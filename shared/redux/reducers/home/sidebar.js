import { SET_GROUPS, UPDATE_GROUPS } from '../../types'

let initialState = {
    initial: [],
    update: []
}

const sidebarReducer = (state=initialState, action) => {
    switch (action.type) {
        case SET_GROUPS:
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
}

export default sidebarReducer
