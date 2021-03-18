import { setPublicAccessKey, setCompanyId, setLogout, setPermissionsHandler } from './utils'
import http from './http'
import websocket from './websocket'

export default {
    setPublicAccessKey: setPublicAccessKey,
    setPermissionsHandler: setPermissionsHandler,
    setLogout: setLogout,
    setCompanyId: setCompanyId,
    http: {
        ...http
    },
    websocket: {
        ...websocket
    }
}