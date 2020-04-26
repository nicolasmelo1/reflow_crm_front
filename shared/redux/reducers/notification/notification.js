import { SET_NOTIFICATION, SET_NOTIFICATION_CONFIGURATION, SET_NOTIFICATION_CONFIGURATION_FIELDS } from '../../types';
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
        fields: {
            notification_fields: [],
            variable_fields: []
        },
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
        case SET_NOTIFICATION_CONFIGURATION_FIELDS:
            return {
                ...state,
                update: {
                    ...state.update,
                    fields: action.payload
                }
            }
        default:
            return state;
    }
}