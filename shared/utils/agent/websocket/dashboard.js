import socket from '../socket'

const DASHBOARD = {
    recieveDataUpdated: async ({data, callback, formName}) => {
        if (data && data.type === 'send_formulary_added_or_updated' && formName === data.data.form_name) {
            return callback(data)
        } else {
            const websocket = socket()
            websocket.addCallback(DASHBOARD.recieveDataUpdated, {callback, formName})
        }
    }
}

export default DASHBOARD