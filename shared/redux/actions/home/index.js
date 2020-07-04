import sidebar from './sidebar'
import list from './list'
import kanban from './kanban'
import formulary from './formulary'
import dashboard from './dashboard'
import filter from './filter'

export default {
    ...filter,
    ...dashboard,
    ...sidebar,
    ...formulary,
    ...list,
    ...kanban
}
