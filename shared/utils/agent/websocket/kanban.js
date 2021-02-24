import Socket from '../socket'

const KANBAN = {
    recieveDataUpdated: async ({data, callback, formName}) => {
        if (data && data.type === 'send_formulary_data_added_or_updated' && formName === data.data.form_name) {
            return callback(data)
        } else if (data === undefined) {
            const websocket = await Socket.getInstance()
            websocket.addCallback(KANBAN.recieveDataUpdated, `KANBAN.recieveDataUpdated`, {callback, formName})
        }
    },
    recieveFormularyUpdated: async({data, callback, formName}) => {
        if (data && data.type === 'send_formulary_created_or_updated' && formName === data.data.form_name) {
            return callback(data)
        } else if (data === undefined) {
            const websocket = await Socket.getInstance()
            websocket.addCallback(KANBAN.recieveFormularyUpdated, `KANBAN.recieveFormularyUpdated`, {callback, formName})
        }
    }
}

export default KANBAN