import {
    SET_KANBAN_INITIAL,
    SET_DATA_KANBAN,
    SET_DIMENSION_ORDER,
    SET_CARDS
} from '../../types'

let initialState = {
    initial: {
        formName: null,
        default_kanban_card_id: null,
        default_dimension_field_id: null,
        dimension_fields: [],
        fields: []
    },
    data: [],
    dimension_order: [],
    cards: [],

}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_KANBAN_INITIAL:
            return {
                ...state,
                initial: action.payload
            }
        case SET_CARDS:
            return {
                ...state,
                cards: action.payload
            }
        case SET_DATA_KANBAN:
            return {
                ...state,
                data: action.payload

            }
        case SET_DIMENSION_ORDER:
            return {
                ...state,
                dimension_order: action.payload
            }
        default:
            return state;
    }
};