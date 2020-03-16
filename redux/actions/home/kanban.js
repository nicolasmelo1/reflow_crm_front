import {
    GET_DATA_KANBAN,
    GET_DIMENSION_ORDER,
    GET_CARD_FIELDS
} from 'redux/types';
import agent from 'redux/agent'


const onGetDataKanban = (params, formName) => {
    return async (dispatch) => {
        let response = await agent.KANBAN.getDataKanban(params, formName)
        dispatch({ type: GET_DATA_KANBAN, payload: response.data });
    }
}

const onGetDimensionOrder = (formName) => {
    return async (dispatch) => {
        let response = await agent.KANBAN.getDimensionOrder(formName)

        dispatch({ type: GET_DIMENSION_ORDER, payload: response.data });
    }
}
const onGetCardFields = (formName) => {
    return async (dispatch) => {
        let response = await agent.KANBAN.getCardFields(formName)
        dispatch({ type: GET_CARD_FIELDS, payload: response.data });
    }
}




export default {
    onGetDataKanban,
    onGetDimensionOrder,
    onGetCardFields
};
