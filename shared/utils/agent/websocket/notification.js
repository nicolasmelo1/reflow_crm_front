import Socket from '../socket'

const NOTIFICATION = {
    recieveNotificationBadge: async ({data, callback}) => {
        if (data && data.type === 'send_notification') {
            return callback(data)
        } else if (data === undefined) {
            const websocket = await Socket.getInstance()
            websocket.addCallback(NOTIFICATION.recieveNotificationBadge, 'NOTIFICATION.recieveNotificationBadge', {callback})
        }
    },
    updateNotificationBadge: async ({data}) => {
        const websocket = await Socket.getInstance()
        websocket.send(data)
    }
}

export default NOTIFICATION