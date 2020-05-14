import { API_ROOT, getToken } from './utils'
import isEqual from '../isEqual'


let registeredSocket = null
let callbacks = []  

/**
 * This function works like a singleton for the websocket, you can have just ONE websocket running 
 * in your browser at a time.
 * 
 * With this function you don't need to specify anything about the websocket. actually you don't
 * even need to know it exists.
 * 
 * You can add callbacks for when it recieves a message from the server with custom arguments.
 * 
 * The websocket reconnects automatically when you close a connection.
 * 
 * This exposes 3 methods: addCallback, getSocket, send
 */
const socket = async () => {
    const token = await getToken()
    const domain = API_ROOT.replace('http://', 'ws://').replace('https://', 'wss://')
    const url = domain + `websocket/?token=${token}`

    function callbacksArrayContainsCallback(callbackObject) {
        for (let i = 0; i < callbacks.length; i++) {
            if (isEqual(callbacks[i], callbackObject)) {
                return true
            }
        }
        return false
    }

    function onRecieve() {
        callbacks.forEach(({callback, argument }) => {
            registeredSocket.addEventListener("message", (e) => callback({ data: JSON.parse(e.data), ...argument}))
        })
    }

    /**
     * 
     */
    function addCallback(callback, argument={}) {
        const callbackObject = {
            callback,
            argument
        }
        if (!callbacksArrayContainsCallback(callbackObject)) {
            callbacks.push(callbackObject)
            registeredSocket.addEventListener("message", (e) => callback({ data: JSON.parse(e.data), ...argument}))
        }
    }

    function getSocket() {
        return registeredSocket
    }

    function onClose() {
        registeredSocket.onclose = (e) => {
            if (process.env.NODE_ENV !== 'production') console.log('Websocket disconnected, retrying...')
            if (e.code === 1000) {
                callbacks = []
            }
            reconnect()
        }
    }

    function reconnect() {
        registeredSocket = new WebSocket(url)

        setTimeout(() => {
            if (registeredSocket.readyState !== 1) {
                if (process.env.NODE_ENV !== 'production') console.log('Could not connect to server, trying again...')
                reconnect()
            } else {
                if (process.env.NODE_ENV !== 'production') console.log('Reconnected.')
                onClose()
                onRecieve()
            }
        }, 10000);
    }

    function connect() {
        registeredSocket = new WebSocket(url)
        onClose()
    }

    const send = (data={}) => {
        registeredSocket.send(JSON.stringify(data))
    }

    
    if (!registeredSocket) {
        connect()
    }

    return {
        addCallback,
        getSocket,
        send
    }
}

export default socket