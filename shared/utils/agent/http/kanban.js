import requests from '../requests'
import { companyId } from '../utils'


const KANBAN = {
    getDefaultDimensionAndKanbanCard: async (source, formName) => {
        return await requests.get(`kanban/${companyId}/${formName}/default/`, {}, {}, source)
    },
    getDimensionAndCardFields: async (source, formName) => {
        return await requests.get(`kanban/${companyId}/${formName}/settings/fields/`, {}, {}, source)
    },
    getCards: async (source, formName) => {
        return await requests.get(`kanban/${companyId}/${formName}/settings/card/`, {}, {}, source)
    },
    createCard: async (body,formName) => {
        return await requests.post(`kanban/${companyId}/${formName}/settings/card/`, body)
    },
    updateCard: async (body, formName, kanbanCardId) => {
        return await requests.put(`kanban/${companyId}/${formName}/settings/card/${kanbanCardId}/`, body)
    },
    removeCard: async(formName, kanbanCardId) => {
        return await requests.delete(`kanban/${companyId}/${formName}/settings/card/${kanbanCardId}/`)
    },
    updateDefault: async (body, formName) => {
        return await requests.put(`kanban/${companyId}/${formName}/settings/default/`, body)
    },
    getDimensionPhases: async (source, formName, dimensionId) => {
        return await requests.get(`kanban/${companyId}/${formName}/dimension/${dimensionId}/`, {}, {}, source)
    },
    updateDimensionPhases: async (body, formName, dimensionId) => {
        return await requests.put(`kanban/${companyId}/${formName}/settings/dimension/${dimensionId}/`, body)
    },
    getData: async (source, params, formName) => {
        return await requests.get(`data/${companyId}/${formName}/all/`, params, {}, source)
    },
    updateCardDimension: async(body, formName) => {
        return await requests.put(`kanban/${companyId}/${formName}/change/`, body)
    }
}

export default KANBAN