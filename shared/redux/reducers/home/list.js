import {
    GET_LISTING_DATA,
    SET_HEADERS,
    UPDATE_HEAD_SELECT
} from '../../types'

let initialState = {
    data: {
        pagination: {
            current: 0,
            total: 0
        },
        data: []
    },
    field_headers: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_LISTING_DATA:
            return {
                ...state,
                data: action.payload

            }
        case SET_HEADERS:
            return {
                ...state,
                field_headers: action.payload
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
