import socket from '../socket'

const NOTIFICATION = {
    recieveNotificationBadge: async ({data, callback}) => {
        if (data && data.type === 'send_notification') {
            return callback(data)
        } else {
            const websocket = socket()
            websocket.addCallback(NOTIFICATION.recieveNotificationBadge, {callback})
        }
    },
    updateNotificationBadge: async ({data}) => {
        const websocket = await socket()
        websocket.send(data)
    }
}

export default NOTIFICATION