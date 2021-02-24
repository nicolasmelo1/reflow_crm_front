import Socket from '../socket'

const DASHBOARD = {
    recieveDataUpdated: async ({data, callback, formName}) => {
        if (data && data.type === 'send_formulary_data_added_or_updated' && formName === data.data.form_name) {
            return callback(data)
        } else if (data === undefined) {
            const websocket = await Socket.getInstance()
            websocket.addCallback(DASHBOARD.recieveDataUpdated, 'DASHBOARD.recieveDataUpdated', {callback, formName})
        }
    }
}

export default DASHBOARD