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
                data: [...state.data, action.payload.data]

            }
        case GET_DIMENSION_ORDER:
            return {
                ...state,
                dimension_order: action.payload.dimension_order
            }
        case GET_CARD_FIELDS:
            return {
                ...state,
                card_fields: action.payload.cards[0].kanban_card_fields
            }
        default:
            return state;
    }
};
