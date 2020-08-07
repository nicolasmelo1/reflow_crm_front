import { SET_NOTIFICATION, SET_NOTIFICATION_CONFIGURATION, SET_NOTIFICATION_BADGE } from '../../types';
//import { createReducer } from '@reduxjs/toolkit'

let initialState = {
    badge: 0,
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

const notificationReducer = (state = initialState, action) => {
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
        case SET_NOTIFICATION_BADGE:
            return {
                ...state,
                badge: action.payload
            }
        default:
            return state;
    }
}

export default notificationReducer