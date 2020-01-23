import { combineReducers } from 'redux';
import sidebar from './sidebar';
import list from './list';

export default combineReducers({
    sidebar,
    list
})