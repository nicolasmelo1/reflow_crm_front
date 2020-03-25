import {
    GET_DATA_KANBAN,
    GET_DIMENSION_ORDER,
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

export default {
    onRenderKanban,
    onGetCards,
    onChangeCardsState,
    onChangeDefaultState,
    onCreateOrUpdateCard,
    onGetDimensionOrders
};
