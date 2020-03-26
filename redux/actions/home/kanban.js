import {
    SET_DATA_KANBAN,
    SET_DIMENSION_ORDER,
    SET_KANBAN_INITIAL,
    SET_CARDS
} from 'redux/types';
import agent from 'redux/agent'

const onRenderKanban = (formName) => {
    return async (dispatch) => {
        let response = await agent.KANBAN.getRenderData(formName)
        dispatch({ type: SET_KANBAN_INITIAL, payload: response.data.data})
    }
}

const onGetCards = (formName) => {
    return async (dispatch) => {
        let response = await agent.KANBAN.getCards(formName)
        dispatch({ type: SET_CARDS, payload: response.data.data })
    }
}

const onCreateOrUpdateCard = (body, formName, cardIndex) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.kanban.cards
        let response = (body.id) ? await agent.KANBAN.updateCard(body, formName, body.id) : await agent.KANBAN.createCard(body, formName)
        if (response.status === 200) {
            stateData[cardIndex] = response.data.data
            dispatch({ type: SET_CARDS, payload: stateData})
        }
    }
}

const onChangeCardsState = (cards) => {
    return (dispatch) => {
        dispatch({ type: SET_CARDS, payload: cards})
    }
}

const onChangeDefaultState = (defaults, formName) => {
    return (dispatch, getState) => {
        let stateData = getState().home.kanban.initial
        const data = {
            ...stateData,
            ...defaults
        }
        agent.KANBAN.updateDefaults(defaults, formName)
        dispatch({ type: SET_KANBAN_INITIAL, payload: data })
    }
}

const onGetDimensionOrders = (formName, dimensionId) => {
    return async (dispatch) => {
        const response = await agent.KANBAN.getDimensionOrders(formName, dimensionId)
        dispatch({ type: SET_DIMENSION_ORDER, payload: response.data.data })
    }
}

const onGetKanbanData = (params, formName) => {
    return async (dispatch, getState) => {
        const initial = getState().home.kanban.initial
        const dimesionOrders = getState().home.kanban.dimension_order
        const cards = getState().home.kanban.cards
        let payload = []

        if (initial.default_kanban_card_id && initial.default_dimension_field_id) {
            const cardFieldIds = cards.filter(card => card.id === initial.default_kanban_card_id)[0].kanban_card_fields.map(field=> field.id)
            const dimension = initial.fields.filter(field=> field.id === initial.default_dimension_field_id)
            
            for (let i=0; i<dimesionOrders.length; i++) {
                const parameters = {
                    ...params,
                    page: 1,
                    search_value: params.search_value.concat(dimesionOrders[i].options),
                    search_exact: params.search_exact.concat(1),
                    search_field: params.search_field.concat(dimension[0].name),
                    fields: cardFieldIds,
                }
                let response = await agent.KANBAN.getData(parameters, formName)
                payload.push([dimesionOrders[i].options, response.data.data])
            }
            dispatch({ type: SET_DATA_KANBAN, payload: payload})
        }
    }
}

export default {
    onRenderKanban,
    onGetCards,
    onGetKanbanData,
    onChangeCardsState,
    onChangeDefaultState,
    onCreateOrUpdateCard,
    onGetDimensionOrders
};
