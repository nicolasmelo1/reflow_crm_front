import sidebar from './sidebar'
import list from './list'
import kanban from './kanban'
import formulary from './formulary'
import dashboard from './dashboard'


export default {
    ...dashboard,
    ...sidebar,
    ...formulary,
    ...list,
    ...kanban
}
