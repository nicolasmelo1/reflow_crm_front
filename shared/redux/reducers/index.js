import { combineReducers } from 'redux'
import types from './types'
import login from './login'
import home from './home'
import notify from './notify'
import notification from './notification'
import templates from './templates'
import { DEAUTHENTICATE } from '../types'


const appReducer = combineReducers({
    types,
    login,
    home,
    notify,
    notification,
    templates
});

const rootReducer = (state, action) => {
    if (action.type === DEAUTHENTICATE) {
        state = undefined;
    }

    return appReducer(state, action)
}



export default rootReducer