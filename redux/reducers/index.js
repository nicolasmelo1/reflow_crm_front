import { combineReducers } from 'redux';
import login from './login';
import errors from './errors';
import home from './home';
import {DEAUTHENTICATE} from 'redux/types'

const appReducer = combineReducers({
    login,
    home,
    errors
 });
 
const rootReducer = (state, action) => {
    if (action.type === DEAUTHENTICATE) {
        state = undefined;
    }
    
    return appReducer(state, action)
}

 

export default rootReducer