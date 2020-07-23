import requests from '../requests'
import { companyId } from '../utils'

const BILLING = {
    getAddressOptions: async (source) => {
        return await requests.get(`billing/${companyId}/settings/address_options/`, {}, {}, source)
    }
}

export default BILLING