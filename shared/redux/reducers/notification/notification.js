import { SET_NOTIFICATION } from '../../types';
//import { createReducer } from '@reduxjs/toolkit'

let initialState = {
    data: {
        pagination: {
            current: 0,
            total: 0
        },
        data: []
    },
    update: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_NOTIFICATION:
            return {
                ...state,
                data: action.payload
            }
        default:
            return state;
    }
}