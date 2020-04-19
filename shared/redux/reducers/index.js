import { combineReducers } from 'redux';
import login from './login';
import errors from './errors';
import home from './home';
import notify from './notify'
import { DEAUTHENTICATE } from '../types'

const appReducer = combineReducers({
    login,
    home,
    errors,
    notify,
});

const rootReducer = (state, action) => {
    if (action.type === DEAUTHENTICATE) {
        window.localStorage.setItem('refreshToken', '')
        window.localStorage.setItem('token', '')
        state = undefined;
    }

    return appReducer(state, action)
}



export default rootReducer