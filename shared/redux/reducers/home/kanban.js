import {
    SET_KANBAN_DEFAULT_DATA,
    SET_DATA_KANBAN,
    SET_DIMENSION_PHASES,
    SET_KANBAN_FIELDS,
    SET_CARDS,
    SET_DIMENSION_IN_SCREEN,
    SET_DIMENSION_COLLAPSED
} from '../../types'

let initialState = {
    initial: {
        defaultKanbanCard: {
            id: null,
            kanbanCardFields: []
        },
        defaultDimensionField: {
            id: null,
            name: null
        }
    },
    updateSettings: {
        fieldsForDimension: [],
        fieldsForCard: [],
    },
    data: [],
    dimension: {
        collapsed: [],
        phases: [],
        inScreenDimensions: [],
    },
    cards: [],

}

const kanbanReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_KANBAN_DEFAULT_DATA:
            return {
                ...state,
                initial: action.payload
            }
        case SET_KANBAN_FIELDS:
            return {
                ...state,
                updateSettings: action.payload
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
        case SET_DIMENSION_PHASES:
            return {
                ...state,
                dimension: {
                    ...state.dimension,
                    phases: action.payload
                }
            }
        case SET_DIMENSION_IN_SCREEN:
            return {
                ...state,
                dimension: {
                    ...state.dimension,
                    inScreenDimensions: action.payload
                }
            }
        case SET_DIMENSION_COLLAPSED: 
            return {
                ...state,
                dimension: {
                    ...state.dimension,
                    collapsed: action.payload
                }
            }
        default:
            return state;
    }
}

export default kanbanReducer