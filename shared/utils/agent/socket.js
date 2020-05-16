import { API_ROOT, getToken } from './utils'
import http from './http'
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
    const domain = API_ROOT.replace('http://', 'ws://').replace('https://', 'wss://')

    async function getUrl() {
        let token = await getToken()
        if (token && token !== '') {
            await http.LOGIN.testToken()
            token = await getToken()
            return domain + `websocket/?token=${token}`
        } else {
            return domain + `websocket/`
        }
    }

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
     * Adds a callback function to be fired when you recieve a new message.
     * Push the function to callbacks if the function is different from the already existing function
     * This prevents duplicate functions
     * 
     * IMPORTANT: With this if you change a callback function in development mode the 
     * function will be added again so it will be fired twice, to prevent this if you change a callback
     * function, always make a full reload of the hole page.
     */
    function addCallback(callback, argument={}) {
        const callbackObject = {
            callback,
            argument
        }
        if (!callbacksArrayContainsCallback(callbackObject)) {
            callbacks.push(callbackObject)
            if (registeredSocket) {
                registeredSocket.addEventListener("message", (e) => callback({ data: JSON.parse(e.data), ...argument}))
            }
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

    async function reconnect() {
        registeredSocket = new WebSocket(await getUrl())

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

    async function connect() {
        registeredSocket = new WebSocket(await getUrl())
        onClose()
        onRecieve()
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