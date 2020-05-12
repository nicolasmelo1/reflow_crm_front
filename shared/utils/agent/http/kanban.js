import requests from '../requests'
import { companyId } from '../utils'


const KANBAN = {
    getRenderData: async (source, formName) => {
        return await requests.get(`${companyId}/data/api/kanban/${formName}/`, {}, {}, source)
    },
    getCards: async (source, formName) => {
        return await requests.get(`${companyId}/data/api/kanban/${formName}/card/`, {}, {}, source)
    },
    createCard: async (body,formName) => {
        return await requests.post(`${companyId}/data/api/kanban/${formName}/card/`, body)
    },
    updateCard: async (body, formName, kanbanCardId) => {
        return await requests.put(`${companyId}/data/api/kanban/${formName}/card/${kanbanCardId}/`, body)
    },
    removeCard: async(formName, kanbanCardId) => {
        return await requests.delete(`${companyId}/data/api/kanban/${formName}/card/${kanbanCardId}/`)
    },
    updateDefaults: async (body, formName) => {
        return await requests.put(`${companyId}/data/api/kanban/${formName}/defaults/`, body)
    },
    getDimensionOrders: async (source, formName, dimensionId) => {
        return await requests.get(`${companyId}/data/api/kanban/${formName}/dimension/${dimensionId}/`, {}, {}, source)
    },
    updateDimensionOrders: async (body, formName, dimensionId) => {
        return await requests.put(`${companyId}/data/api/kanban/${formName}/dimension/${dimensionId}/`, body)
    },
    getData: async (source, params, formName) => {
        return await requests.get(`${companyId}/data/api/data/${formName}/`, params, {}, source)
    },
    updateCardDimension: async(body, formName) => {
        return await requests.put(`${companyId}/data/api/kanban/${formName}/change/`, body)
    }
}

export default KANBAN