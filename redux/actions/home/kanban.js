import {
    GET_DATA_KANBAN,
    GET_DIMENSION_ORDER,
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
        stateData[cardIndex] = response.data.data
        dispatch({ type: SET_CARDS, payload: stateData})
    }
}

const onChangeCardsState = (cards) => {
    return (dispatch) => {
        dispatch({ type: SET_CARDS, payload: cards})
    }
}

export default {
    onRenderKanban,
    onGetCards,
    onChangeCardsState,
    onCreateOrUpdateCard
};
