import requests from '../requests'
import { companyId } from '../utils'

const USERS = {
    getUserData: async (source) => {
        return await requests.get(`authentication/user/`, {}, {}, source)
    },
    getFormularyAndFieldOptions: async (source) => {
        return await requests.get(`authentication/settings/${companyId}/users/formulary_options/`, {}, {}, source)
    },
    getUsersConfiguration: async (source) => {
        return await requests.get(`authentication/settings/${companyId}/users/`, {}, {}, source)
    },
    updateUsersConfiguration: async (body, userId) => {
        return await requests.put(`authentication/settings/${companyId}/users/${userId}/`, body)
    },
    createUsersConfiguration: async (body) => {
        return await requests.post(`authentication/settings/${companyId}/users/`, body)
    },
    removeUsersConfiguration: async (userId) => {
        return await requests.delete(`authentication/settings/${companyId}/users/${userId}/`)
    }
}

export default USERS