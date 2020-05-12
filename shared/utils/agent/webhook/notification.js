import Socket from '../socket'

const NOTIFICATION = {
    recieveNotification: async () => {
        const socket = new Socket()
        return socket.start('websocket/notification/read/')
    }
}

export default NOTIFICATION