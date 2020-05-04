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
        if (process.env['APP'] === 'web') {
            window.localStorage.setItem('refreshToken', '')
            window.localStorage.setItem('token', '')
        } else {
            AsyncStorage.setItem('refreshToken', '')
            AsyncStorage.setItem('token', '')
        }
        state = undefined;
    }

    return appReducer(state, action)
}



export default rootReducer