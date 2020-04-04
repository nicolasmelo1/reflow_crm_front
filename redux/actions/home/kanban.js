import {
    SET_DATA_KANBAN,
    SET_DIMENSION_ORDER,
    SET_KANBAN_INITIAL,
    SET_CARDS
} from 'redux/types';
import agent from 'redux/agent'

const onRenderKanban = (formName) => {
    return async (dispatch) => {
        try {
            let response = await agent.KANBAN.getRenderData(formName)
            
            dispatch({ type: SET_KANBAN_INITIAL, payload: response.data.data})
        } catch {}
    }
}

const onGetCards = (formName) => {
    return async (dispatch) => {
        try {
            let response = await agent.KANBAN.getCards(formName)
            dispatch({ type: SET_CARDS, payload: response.data.data })
        } catch {}
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
        try {
            const response = await agent.KANBAN.getDimensionOrders(formName, dimensionId)
            dispatch({ type: SET_DIMENSION_ORDER, payload: response.data.data })
            return response
        } catch {}
    }
}

const onChangeDimensionOrdersState = (dimensionOrders, dimensionId=null, formName=null) => {
    return (dispatch) => {
        if (dimensionId && formName) {
            agent.KANBAN.updateDimensionOrders(dimensionOrders, dimensionId, formName)
        }
        dispatch({ type: SET_DIMENSION_ORDER, payload: dimensionOrders })
    }
}

// if columnName is set get the data for a single column
const onGetKanbanData = (params, formName, columnName = null) => {
    return async (dispatch, getState) => {
        const initial = getState().home.kanban.initial
        const dimensionOrders = getState().home.kanban.dimension_order
        const cards = getState().home.kanban.cards
        const data = getState().home.kanban.data

        let payload = []

        try {
            if (initial.default_kanban_card_id && initial.default_dimension_field_id) {
                const dimension = initial.fields.filter(field=> field.id === initial.default_dimension_field_id)
                const cardFieldIds = cards.filter(card => card.id === initial.default_kanban_card_id)[0].kanban_card_fields.map(field=> field.id).concat(dimension[0].id)
                const defaultParameters = {
                    ...params,
                    search_exact: params.search_exact.concat(1),
                    search_field: params.search_field.concat(dimension[0].name),
                    fields: cardFieldIds,
                }
                if (!columnName) {
                    for (let i=0; i<dimensionOrders.length; i++) {
                        const parameters = {
                            ...defaultParameters,
                            search_value: params.search_value.concat(dimensionOrders[i].options),
                        }
                        let response = await agent.KANBAN.getData(parameters, formName)
                        payload.push({
                            dimension: dimensionOrders[i].options, 
                            pagination: response.data.pagination,
                            data: response.data.data
                        })
                    }
                } else {
                    const parameters = {
                        ...defaultParameters,
                        search_value: params.search_value.concat(columnName),
                    }
                    let response = await agent.KANBAN.getData(parameters, formName)
                    const dimensionIndexInData = data.findIndex(dimensionData => dimensionData.dimension === columnName)
                    if (dimensionIndexInData !== -1) {
                        data[dimensionIndexInData].pagination = response.data.pagination
                        data[dimensionIndexInData].data = data[dimensionIndexInData].data.concat(response.data.data)
                        payload = [...data]
                    } else {
                        payload.push({
                            dimension: columnName, 
                            pagination: response.data.pagination,
                            data: response.data.data
                        })
                    }
                    
                }
                dispatch({ type: SET_DATA_KANBAN, payload: payload})
            }
        } catch {}
        return payload
    }
}


const onChangeKanbanData = (body, formName, data) => {
    return async (dispatch) => {
        try {
            const response = await agent.KANBAN.updateCardDimension(body, formName)
            if (response.status === 200){
                dispatch({ type: SET_DATA_KANBAN, payload: data})
            } else {
                return response
            }
        }
        catch {}
    }
}

export default {
    onRenderKanban,
    onGetCards,
    onGetKanbanData,
    onChangeKanbanData,
    onChangeCardsState,
    onChangeDefaultState,
    onCreateOrUpdateCard,
    onGetDimensionOrders,
    onChangeDimensionOrdersState
};
