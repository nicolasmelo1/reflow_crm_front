import sidebar from './sidebar'
import list from './list'
import kanban from './kanban'
import formulary from './formulary'
import dashboard from './dashboard'
import filter from './filter'
import automation from './automation'

export default {
    ...filter,
    ...dashboard,
    ...sidebar,
    ...formulary,
    ...list,
    ...kanban,
    ...automation
}
