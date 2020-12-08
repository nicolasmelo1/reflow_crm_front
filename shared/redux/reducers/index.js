import { combineReducers } from 'redux'
import login from './login'
import home from './home'
import notify from './notify'
import notification from './notification'
import templates from './templates'
import billing from './billing'
import company from './company'
import users from './users'
import pdf_generator from './pdf_generator'
import navbar from './navbar'
import { DEAUTHENTICATE } from '../types'


const appReducer = combineReducers({
    login,
    home,
    notify,
    notification,
    templates,
    billing,
    company,
    users,
    pdf_generator,
    navbar
})

const rootReducer = (state, action) => {
    if (action.type === DEAUTHENTICATE) {
        state = undefined;
    }
    if (process.env['APP'] === 'web') {
        const HYDRATE = require('next-redux-wrapper').HYDRATE
        if (action.type === HYDRATE) {
            const nextState = {
                ...state,
                ...action.payload,
            }
            return nextState
        }          
    }

    return appReducer(state, action)
}



export default rootReducer