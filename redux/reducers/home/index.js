import { combineReducers } from 'redux';
import sidebar from './sidebar';
import list from './list';
import kanban from './kanban'

export default combineReducers({
    sidebar,
    list,
    kanban
})