import {
    GET_DATA,
    SET_HEADERS,
    SET_TOTALS,
    UPDATE_HEAD_SELECT
} from 'redux/types'

let initialState = {
    data: [],
    header: {
        field_headers: [],
    },
    totals: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA:
            return {
                ...state,
                data: action.payload

            }
        case SET_HEADERS:
            return {
                ...state,
                header: action.payload
            }
        case SET_TOTALS:
            return {
                ...state,
                totals: action.payload
            }            
        case UPDATE_HEAD_SELECT:
            return {
                ...state,
                header: {
                    ...state.header,
                    field_headers: action.payload
                }
            }
        default:
            return state;
    }
};
