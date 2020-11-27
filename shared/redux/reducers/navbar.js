import { SET_NAVBAR_IS_IN_HOME_SCREEN } from '../types'

const initialState = {
    isInHomeScreen: false
}

const navbarReducer = (state=initialState, action) => {
    switch (action.type) {
        case SET_NAVBAR_IS_IN_HOME_SCREEN:
            return {
                isInHomeScreen: action.payload,
            }
        default:
            return state
    }
}

export default navbarReducer