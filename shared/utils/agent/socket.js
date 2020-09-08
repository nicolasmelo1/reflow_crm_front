import { API_ROOT, getToken } from './utils'
import http from './http'
import isEqual from '../isEqual'


/**
 * This function works like a singleton for the websocket, you can have just ONE websocket running 
 * in your browser/mobile device at a time.
 * 
 * With this function you don't need to specify anything about the websocket. Actually you don't
 * even need to know it exists.
 * 
 * You can add callbacks for when it recieves a message from the server with custom arguments.
 * 
 * The websocket reconnects automatically when you close the connection.
 * 
 * This exposes 3 methods: addCallback, getSocket, send
 */
class Socket {
    static instance = null

    domain = API_ROOT.replace('http://', 'ws://').replace('https://', 'wss://')
    registeredSocket = null
    callbacks = []  
    registeredCallbacks = []
    registering = false

    /*constructor() {
        if (!this.registeredSocket && !this.registering) {
            this.registering = true
            this.connect()
            console.log(`connections: ${connections}`)
        }
    }*/

    static getInstance() {
        // socket is a function, when you run this function it automatically connects to the server because
        // `registeredSocket` is null and it is not `registering` anything
        if (Socket.instance == null) {
            Socket.instance = new Socket()
    
            if (!Socket.instance.registeredSocket && !Socket.instance.registering) {
                Socket.instance.registering = true
                Socket.instance.connect()
            }
        }

        return this.instance
    }
    
    /**
     * Gets the url to connect to the websocket. If the user is logged (so the token is not empty and is defined)
     * the url will contain a query parameter with the token.
     * 
     * Otherwise no query param will be added on the url to make the connection.
     */
    async getUrl() {
        let token = await getToken()
        if (token && token !== '') {
            await http.LOGIN.testToken()
            token = await getToken()
            return this.domain + `websocket/?token=${token}`
        } else {
            return this.domain + `websocket/`
        }
    }

    /**
     * Checks if a callback function is already in the array of callbacks and returns the index of the 
     * registered callback in the array of callbacks.
     * 
     * @param {Function} callbackFunction - The function that you want to check if exists in the array of callbacks.
     */
    callbacksArrayContainsCallback(callbackFunction) {
        for (let i = 0; i < this.callbacks.length; i++) {
            if (isEqual(this.callbacks[i], callbackFunction)) {
                return i
            }
        }
        return -1
    }

    /**
     * Adds the "message" event listener to the websocket for each callback registered callback.
     * We need this on a separate function because when we lose the connection, we create a new 
     * websocket and then we need to register all of the event listeners to the websocket again. 
     * 
     * It's important to notice that we ALWAYS send `data` as an argument also. And that the argument
     * to the callback function is actually an object.
     */
    onRecieve() {
        if (this.registeredSocket) {
            this.callbacks.forEach(({ callback, argument }) => {
                if (!this.registeredCallbacks.includes(callback.toString())) {
                    if (process.env['APP'] === 'web') {
                        this.registeredSocket.addEventListener("message", (e) => {
                            callback({ data: JSON.parse(e.data), ...argument})
                        })
                    } else {
                        this.registeredSocket.onmessage = (e) => {
                            callback({ data: JSON.parse(e.data), ...argument})
                        }
                    }
                    this.registeredCallbacks.push(callback.toString())
                }
            })
        }
    }

    /**
     * Adds a callback function to be fired when you recieve a new message.
     * Push the function to callbacks if the function is different from the already existing function
     * This prevents duplicate functions
     * 
     * IMPORTANT: With this if you change a callback function in development mode the 
     * function will be added again so it will be fired twice, to prevent this if you change a callback
     * function, always make a full reload of the hole page.
     * 
     * @param {Function} callback - The function that you want to run when a new message is recieved.
     * @param {Object} argument - The arguments that you will pass to the callback function when a new message is recieved.
     */
    addCallback(callback, argument={}) {
        const callbackObject = {
            callback,
            argument
        }
        const callbackIndex = this.callbacksArrayContainsCallback(callbackObject)
        if (callbackIndex !== -1) {
            this.callbacks.splice(callbackIndex, 1)
        }
        this.callbacks.push(callbackObject)
        this.onRecieve()
    }


    /**
     * Register the onclose event listener on the socket.
     */
    onClose() {
        this.registeredSocket.onclose = (e) => {
            if (process.env.NODE_ENV !== 'production') console.log('Websocket disconnected, retrying...')
            if (e.code === 1000) {
                this.callbacks = []
                this.registeredCallbacks = []
            }
            this.reconnect()
        }
    }

     /**
     * Tries to reconnect to the server when the connection is closed. It waits 10 seconds for every
     * try.
     */
    async reconnect() {
        this.registeredSocket = new WebSocket(await this.getUrl())

        setTimeout(() => {
            if (this.registeredSocket.readyState !== 1) {
                if (process.env.NODE_ENV !== 'production') console.log('Could not connect to server, trying again...')
                this.registeredSocket.close()
                this.reconnect()
            } else {
                if (process.env.NODE_ENV !== 'production') console.log('Reconnected.')
                this.onClose()
                this.registeredCallbacks = []
                this.onRecieve()
                this.appStateChanged()
            }
        }, 10000);
    }

    async connect() {
        if (!this.registeredSocket) {
            this.registeredSocket = new WebSocket(await this.getUrl())
            this.onClose()
            this.onRecieve()
            this.appStateChanged()
        }
    }

    /**
     * MOBILE ONLY. When the user closes the app on mobile, it disconnects from the 
     */
    appStateChanged() {
        if (process.env['APP'] !== 'web') {
            AppState.addEventListener("change", (e) => {
                if (this.registeredSocket) {
                    this.registeredSocket.close()
                }
            })
        }
    }

    send = (data={}) => {
        this.registeredSocket.send(JSON.stringify(data))
    }
}


export default Socket