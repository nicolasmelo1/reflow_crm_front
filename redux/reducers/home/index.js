import { combineReducers } from 'redux';
import sidebar from './sidebar';
import list from './list';
import formulary from './formulary';

export default combineReducers({
    sidebar,
    formulary,
    list
})