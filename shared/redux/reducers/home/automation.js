import { SET_AUTOMATION_APPS } from '../../types'


let initialState = {
    availableApps: [],
}

const automationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTOMATION_APPS:
            return {
                ...state,
                availableApps: action.payload
            }
        default:
            return state
    }
}

export default automationReducer