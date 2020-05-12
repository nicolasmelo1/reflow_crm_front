import { setCompanyId } from './utils'
import http from './http'
import webhook from './webhook'

export default {
    setCompanyId: setCompanyId,
    http: {
        ...http
    },
    webhook: {
        ...webhook
    }
}