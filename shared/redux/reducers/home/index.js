import { combineReducers } from 'redux'
import sidebar from './sidebar'
import list from './list'
import formulary from './formulary'
import kanban from './kanban'
import dashboard from './dashboard'
import filter from './filter'
import automation from './automation'

export default combineReducers({
    filter,
    dashboard,
    sidebar,
    formulary,
    list,
    kanban,
    automation
})