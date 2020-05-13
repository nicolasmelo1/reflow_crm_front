import socket from '../socket'
import { companyId } from '../utils'

const NOTIFICATION = {
    recieveNotification: async (callback) => {
        return socket.connect(`websocket/${companyId}/notification/read/`, callback)
    }
}

export default NOTIFICATION