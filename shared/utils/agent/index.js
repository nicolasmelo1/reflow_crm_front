import { setCompanyId, setLogout } from './utils'
import http from './http'
import websocket from './websocket'

export default {
    setLogout: setLogout,
    setCompanyId: setCompanyId,
    http: {
        ...http
    },
    websocket: {
        ...websocket
    }
}