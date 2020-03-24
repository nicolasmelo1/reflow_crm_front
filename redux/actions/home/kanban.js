import {
    GET_DATA_KANBAN,
    GET_DIMENSION_ORDER,
    SET_KANBAN_INITIAL,
    GET_CARDS
} from 'redux/types';
import agent from 'redux/agent'

const onRenderKanban = (formName) => {
    return async (dispatch) => {
        let response = await agent.KANBAN.getRenderData(formName)
        dispatch({ type: SET_KANBAN_INITIAL, payload: response.data.data})
    }
}

const onGetDataKanban = (params, formName) => {
    return async (dispatch) => {
        let response = await agent.KANBAN.getData(params, formName)
        dispatch({ type: GET_DATA_KANBAN, payload: response.data.data });
    }
}

const onGetDimensionOrder = (formName) => {
    return async (dispatch) => {
        let response = await agent.KANBAN.getDimensionOrder(formName)

        dispatch({ type: GET_DIMENSION_ORDER, payload: response.data });
    }
}
const onGetCards = (formName) => {
    return async (dispatch) => {
        let response = await agent.KANBAN.getCards(formName)
        dispatch({ type: GET_CARDS, payload: response.data.data });
    }
}

export default {
    onRenderKanban,
    onGetDataKanban,
    onGetDimensionOrder,
    onGetCards
};
