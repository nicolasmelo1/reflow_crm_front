import Socket from '../socket'

const COMPANY = {
    recieveCompanyUpdated: async ({data, callback, companyId}) => {
        if (data && ['send_company_was_updated', 'send_billing_was_updated'].includes(data.type) && companyId === data.data.company_id) {
            return callback(data)
        } else if (data === undefined) {
            const websocket = Socket.getInstance()
            websocket.addCallback(COMPANY.recieveCompanyUpdated, {callback, companyId})
        }
    }
}

export default COMPANY