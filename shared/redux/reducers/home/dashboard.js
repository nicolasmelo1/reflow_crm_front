import { SET_DASHBOARD_CHARTS } from '../../types'

let initialState = {
    charts: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_DASHBOARD_CHARTS:
            return {
                ...state,
                charts: action.payload
            }
        default:
            return state
    }
}