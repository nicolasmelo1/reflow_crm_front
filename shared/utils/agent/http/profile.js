import requests from '../requests'
import { formEncodeData } from '../utils'

const PROFILE = {
    getProfile: async (source) => {
        return await requests.get(`authentication/settings/me/`, {}, {}, source)
    },
    updateProfile: async (body, file) => {
        return await requests.post(`authentication/settings/me/`, formEncodeData(`data`, body, [file]), { 'Content-Type': `multipart/form-data`})
    }
}

export default PROFILE