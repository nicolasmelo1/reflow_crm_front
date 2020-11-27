import { SET_NAVBAR_IS_IN_HOME_SCREEN } from '../types'

const onChangeNavbarIsInHomeScreen = (isInHomeScreen) => {
    return (dispatch, getState) => {
        dispatch({ type: SET_NAVBAR_IS_IN_HOME_SCREEN, payload: isInHomeScreen })
    }
}

export default {
    onChangeNavbarIsInHomeScreen
}