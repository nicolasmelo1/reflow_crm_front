import axios from 'axios'
import config from '@shared/config'
import base64 from '@shared/utils/base64'
import FormData from 'form-data'
import fs from 'fs'

const API = {
    createRecord: async (companyId, formName, body, headers) => {
        return axios.post(`${config.API}data/external/api/${companyId}/${formName}/`, body, {
            headers: headers
        })
    },
    createDraft: async (companyId, file, headers) => {
        const formData = new FormData()
        const data = fs.readFileSync(file[0].filepath)
        formData.append(base64.encode(file[0].originalFilename), data)

        return axios.post(`${config.API}draft/external/api/${companyId}/`, formData, {
            headers: headers
        })
    }
}

export default {
    API
}