import { API_ROOT, getToken } from './utils'

const socket = () => {
    socket = null
    url = null

    function recieve(callback) {
        socket.onmessage = (e) => callback(JSON.parse(e.data))
    }

    /**
    * When you disconnect to the websocket it automatically tries to reconnect
    * in order to retrieve all of the messages from the server
    */
    function reconnect(callback) {
        socket = new WebSocket(url)
        
    }

    async function connect(path, callback = () => {}) {
        const token = await getToken()
        const domain = API_ROOT.replace('http://', '').replace('https://', '')
        const websocket = 'ws://' + domain
        url = websocket+path + `?token=${token}`
        socket = new WebSocket(url)

        setTimeout(() => {
            if (socket.readyState !== 1) {
                if (process.env.NODE_ENV !== 'production') console.log('Could not connect to server, trying again...')
                connect(callback)
            } else {
                if (process.env.NODE_ENV !== 'production') console.log('Reconnected.')
                recieve(callback)
            }
        }, 10000);

        socket.onclose = (e) => {
            if (process.env.NODE_ENV !== 'production') console.log('Websocket disconnected, retrying...')
            connect(callback)
        }

        return socket
    }

    const send = (data={}) => {
        socket.send(JSON.stringify(data))
    }
}

export default socket