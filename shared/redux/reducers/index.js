import { combineReducers } from 'redux'
import login from './login'
import home from './home'
import notify from './notify'
import notification from './notification'
import templates from './templates'
import billing from './billing'
import company from './company'
import { DEAUTHENTICATE } from '../types'


const appReducer = combineReducers({
    login,
    home,
    notify,
    notification,
    templates,
    billing,
    company
});

const rootReducer = (state, action) => {
    if (action.type === DEAUTHENTICATE) {
        state = undefined;
    }

    return appReducer(state, action)
}



export default rootReducer