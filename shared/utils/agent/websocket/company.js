import socket from '../socket'

const COMPANY = {
    recieveBillingUpdated: async ({data, callback, companyId}) => {
        if (data && data.type === 'send_billing_was_updated' && companyId === data.data.company_id) {
            return callback(data)
        } else {
            const websocket = socket()
            websocket.addCallback(COMPANY.recieveBillingUpdated, {callback, companyId})
        }
    }
}

export default COMPANY