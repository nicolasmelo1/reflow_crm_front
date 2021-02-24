import Socket from '../socket'

const FORMULARY = {
    recieveFormularyUpdated: async ({data, callback, formId}) => {
        if (data && data.type === 'send_formulary_created_or_updated') {
            return callback(data)
        } else if (data === undefined) {
            const websocket = await Socket.getInstance()
            websocket.addCallback(FORMULARY.recieveFormularyUpdated, `FORMULARY.recieveFormularyUpdated`, {callback, formId})
        }
    }
}

export default FORMULARY