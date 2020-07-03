import { combineReducers } from 'redux'
import sidebar from './sidebar'
import list from './list'
import formulary from './formulary'
import kanban from './kanban'
import dashboard from './dashboard'

export default combineReducers({
    dashboard,
    sidebar,
    formulary,
    list,
    kanban
})