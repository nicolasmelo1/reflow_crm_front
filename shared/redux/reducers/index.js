import { combineReducers } from 'redux'
import login from './login'
import home from './home'
import notify from './notify'
import notification from './notification'
import { DEAUTHENTICATE } from '../types'
import { AsyncStorage } from 'react-native'


const appReducer = combineReducers({
    login,
    home,
    notify,
    notification
});

const rootReducer = (state, action) => {
    if (action.type === DEAUTHENTICATE) {
        state = undefined;
    }

    return appReducer(state, action)
}



export default rootReducer