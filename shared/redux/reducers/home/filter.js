import { SET_FILTER_SEARCH } from '../../types'

let initialState = {
    sort_value: [],
    sort_field: [],
    search_value: [],
    search_exact: [],
    search_field: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_FILTER_SEARCH:
            return {
                ...state,
                search_value: action.payload.search_value,
                search_exact: action.payload.search_exact,
                search_field: action.payload.search_field
            }
        default:
            return state
    }
}
