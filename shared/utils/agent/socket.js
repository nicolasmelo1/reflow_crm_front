import { API_ROOT, getToken } from './utils'
import http from './http'
import { AppState } from 'react-native'

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
    callbacks = {} 
    registering = false

    static async getInstance() {
        // socket is a function, when you run this function it automatically connects to the server because
        // `registeredSocket` is null and it is not `registering` anything
        if (Socket.instance == null) {
            Socket.instance = new Socket()
        }

        if (!this.instance.registeredSocket && !this.instance.registering) {
            this.instance.registering = true
            await this.instance.connect()
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
     * Adds the "onmessage" event listener to the websocket. We call each each registered callback
     * whenever we recieve a message.
     * Use event listeners here wont work because we don't have any control of previously registered
     * event listeners, it can lead to unexpected results. Calling everything once we recieve a new message
     * makes it easier to debug and know what is happening.
     * 
     * We need this on a separate function because when we lose the connection, we create a new 
     * websocket and then we need to register all of the event listeners to the websocket again. 
     * 
     * It's important to notice that we ALWAYS send `data` as an argument. And that the argument
     * to the callback function is actually an object.
     */
    onRecieve() {
        if (this.registeredSocket !== null) {
            this.registeredSocket.onmessage = (e) => {
                [...Object.values(this.callbacks)].forEach(({ callback, argument }) => {
                    callback({ data: JSON.parse(e.data), ...argument})
                })
            }
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
     * @param {String} callbackName - This is the function name that you are adding, sometimes you might want to append multiple
     * equal functions (like on a loop). So what you do is simply give unique names to the function, this way you can add multiple
     * equal callbacks of the same function but treated differently.
     * @param {Object} argument - The arguments that you will pass to the callback function when a new message is recieved.
     */
    addCallback(callback, callbackName, argument={}) {
        const callbackObject = {
            callback,
            argument
        }
        //const hasCallback = this.callbacks.hasOwnProperty(callbackName)
        this.callbacks[callbackName] = callbackObject
        this.onRecieve()
    }


    /**
     * Register the onclose event listener on the socket.
     */
    onClose() {
        this.registeredSocket.onclose = (e) => {
            if (process.env.NODE_ENV !== 'production') console.log('Websocket disconnected, retrying...')
            if (e.code === 1000) {
                this.callbacks = {}
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
                this.onRecieve()
                this.appStateChanged()
            }
        }, 10000);
    }

    async connect() {
        if (this.registeredSocket === null) {
            this.registeredSocket = new WebSocket(await this.getUrl())
            this.onClose()
            this.onRecieve()
            this.appStateChanged()
        }
        this.registering = false
    }

    /**
     * MOBILE ONLY. When the user closes the app on mobile, it disconnects from the websocket connection
     * and it only opens again when the user opens the app again.
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