import {
    GET_DATA,
    GET_HEADERS,
    GET_TOTALS,
    UPDATE_HEAD_SELECT
} from 'redux/types'
import { UPDATE_FILTERS } from '../../types';

let initialState = {
    data: [],
    header: {
        field_headers: [],
        data_types: [],
        number_format_types: [],
        fields: []
    },
    totals: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA:
            return {
                ...state,
                data: action.payload.data

            }
        case GET_HEADERS:
            return {
                ...state,
                header: action.payload.data
            }
        case GET_TOTALS:
            return {
                ...state,
                totals: action.payload.totals
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
