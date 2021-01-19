import Socket from '../socket'

const LISTING = {
    recieveDataUpdated: async ({data, callback, formName}) => {
        if (data && data.type === 'send_formulary_added_or_updated' && formName === data.data.form_name) {
            return callback(data)
        } else if (data === undefined) {
            const websocket = await Socket.getInstance()
            websocket.addCallback(LISTING.recieveDataUpdated, 'LISTING.recieveDataUpdated', {callback, formName})
        }
    }
}

export default LISTING