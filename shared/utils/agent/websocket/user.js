import Socket from '../socket'

const USER = {
    recieveUserUpdated: async ({data, callback, companyId}) => {
        if (data && data.type === 'send_user_was_updated') {
            return callback(data)
        } else if (data === undefined) {
            const websocket = await Socket.getInstance()
            websocket.addCallback(USER.recieveUserUpdated, 'USER.recieveUserUpdated', {callback, companyId})
        }
    }
}

export default USER