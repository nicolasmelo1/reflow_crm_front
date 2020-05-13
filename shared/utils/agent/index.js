import { setCompanyId } from './utils'
import http from './http'
import websocket from './websocket'

export default {
    setCompanyId: setCompanyId,
    http: {
        ...http
    },
    websocket: {
        ...websocket
    }
}