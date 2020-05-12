import { API_ROOT, getToken } from './utils'

class Socket {
    constructor() {
        this.socket = null
    }

    start = async (path) => {
        const token = await getToken()
        const domain = API_ROOT.replace('http://', '').replace('https://', '')
        const websocket = 'ws://' + domain
        this.socket = new WebSocket(websocket+path + `?token=${token}`)
        this.socket.onclose = (e) => {
            console.log('Socket disconected, reconnecting...')
            this.socket = new WebSocket(websocket+path + `token=${token}`)
        }
        console.log(this.socket)
        return this
    }

    recieve = (callback) => {
        this.socket.onmessage = (e) => callback(JSON.parse(e.data))
    }

    send = (data={}) => {
        this.socket.send(JSON.stringify(data))
    }
}

export default Socket