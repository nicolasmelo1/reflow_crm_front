import {
    GET_DATA_KANBAN,
    GET_DIMENSION_ORDER,
    GET_CARD_FIELDS
} from 'redux/types';

let initialState = {
    data: [],
    dimension_order: [],
    card_fields: [],

}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_KANBAN:
            return {
                ...state,
                data: action.payload

            }
        case GET_DIMENSION_ORDER:
            return {
                ...state,
                dimension_order: action.payload
            }
        case GET_CARD_FIELDS:
            return {
                ...state,
                card_fields: action.payload
            }
        default:
            return state;
    }
};
