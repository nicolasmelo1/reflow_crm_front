import { OPEN_FORMULARY, SET_FORMULARY_SETTINGS_DATA } from '../../types';
//import { createReducer } from '@reduxjs/toolkit'

let initialState = {
    isOpen: false,
    update: {}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_FORMULARY:
            return {
                ...state,
                isOpen: action.payload
            }
        case SET_FORMULARY_SETTINGS_DATA:
            return {
                ...state,
                update: action.payload
            }
        default:
            return state;
    }
}