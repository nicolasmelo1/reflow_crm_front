import { SET_NOTIFICATION, SET_NOTIFICATION_CONFIGURATION } from '../../types';
//import { createReducer } from '@reduxjs/toolkit'

let initialState = {
    data: {
        pagination: {
            current: 0,
            total: 0
        },
        data: []
    },
    update: {
        data:[]
    },
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_NOTIFICATION:
            return {
                ...state,
                data: action.payload
            }
        case SET_NOTIFICATION_CONFIGURATION:
            return {
                ...state,
                update: {
                    ...state.update,
                    data: action.payload
                }
            }
        default:
            return state;
    }
}