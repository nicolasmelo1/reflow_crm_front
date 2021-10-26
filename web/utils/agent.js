import axios from 'axios'
import config from '@shared/config'

const API = {
    createRecord: async (companyId, formName, body, headers) => {
        return axios.post(`${config.API}data/external/api/${companyId}/${formName}/`, body, {
            headers: headers
        })
    }
}

export {
    API
}