import socket from '../socket'

const DASHBOARD = {
    recieveDataUpdated: async ({data, callback, form_id}) => {
        if (data && data.type === 'send_formulary_added_or_updated') {
            return callback(data)
        } else {
            const websocket = socket()
            websocket.addCallback(DASHBOARD.recieveDataUpdated, {callback, form_id})
        }
    }
}

export default DASHBOARD