import {
    SET_DATA_KANBAN,
    SET_DIMENSION_ORDER,
    SET_KANBAN_INITIAL,
    SET_CARDS
} from '../../types';
import agent from '../../../utils/agent'
import delay from '../../../utils/delay'


const makeDelay = delay(10000)


const getKanbanData = async (dispatch, source, state, params, formName, columnName) => {
    const initial = state.home.kanban.initial
    const dimensionOrders = state.home.kanban.dimension_order
    const cards = state.home.kanban.cards
    const data = state.home.kanban.data

    let payload = []

    if (initial.default_kanban_card_id && initial.default_dimension_field_id) {
        const dimension = initial.fields.filter(field=> field.id === initial.default_dimension_field_id)
        const cardFieldIds = cards.filter(card => card.id === initial.default_kanban_card_id)[0].kanban_card_fields.map(field=> field.id).concat(dimension[0].id)
        const defaultParameters = {
            search_exact: params.search_exact.concat(1),
            search_field: params.search_field.concat(dimension[0].name),
            fields: cardFieldIds,
        }
        if (!columnName) {
            const promises = dimensionOrders.map(async (dimensionOrder) => {
                const parameters = {
                    ...defaultParameters,
                    page: 1,
                    search_value: params.search_value.concat(dimensionOrder.options),
                }
                let response = await agent.http.KANBAN.getData(source, parameters, formName)
                if (response && response.status === 200) {
                    payload.push({
                        dimension: dimensionOrder.options, 
                        pagination: response.data.pagination,
                        data: response.data.data
                    })
                }
            })
            await Promise.all(promises);
        } else {
            const parameters = {
                ...defaultParameters,
                page: (params.page) ? params.page : 1,
                search_value: params.search_value.concat(columnName),
            }
            let response = await agent.http.KANBAN.getData(source, parameters, formName)
            if (response && response.status === 200) {
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
            
        }
        dispatch({ type: SET_DATA_KANBAN, payload: payload})
    }
    return payload
}


const onRenderKanban = (source, formName) => {
    return async (dispatch) => {
        try {
            let response = await agent.http.KANBAN.getRenderData(source, formName)
            dispatch({ type: SET_KANBAN_INITIAL, payload: {
                formName: formName,
                ...response.data.data
            }})
        } catch {}
    }
}

const onGetCards = (source, formName) => {
    return async (dispatch) => {
        try {
            let response = await agent.http.KANBAN.getCards(source, formName)
            dispatch({ type: SET_CARDS, payload: response.data.data })
        } catch {}
    }
}

const onCreateOrUpdateCard = (body, formName, cardIndex) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.kanban.cards
        let response = (body.id) ? await agent.http.KANBAN.updateCard(body, formName, body.id) : await agent.http.KANBAN.createCard(body, formName)
        if (response.status === 200) {
            stateData[cardIndex] = response.data.data
            dispatch({ type: SET_CARDS, payload: stateData})
        }
    }
}

const onRemoveCard = (formName, cardIndex) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.kanban.cards
        const stateInitial = getState().home.kanban.initial
        if (stateData[cardIndex].id) {
            agent.http.KANBAN.removeCard(formName, stateData[cardIndex].id)
            if (stateData[cardIndex].id === stateInitial.default_kanban_card_id) {
                const payload = {
                    ...stateInitial,
                    default_kanban_card_id: null
                }
                dispatch({ type: SET_KANBAN_INITIAL, payload: payload })

            }
        }
        stateData.splice(cardIndex, 1)
        dispatch({ type: SET_CARDS, payload: stateData})
    }
}

const onChangeCardsState = (cards) => {
    return (dispatch) => {
        dispatch({ type: SET_CARDS, payload: cards})
    }
}

const onChangeDefaultState = (defaults, formName=null) => {
    return (dispatch, getState) => {
        let stateData = getState().home.kanban.initial
        const data = {
            ...stateData,
            ...defaults
        }
        if (formName) {
            agent.http.KANBAN.updateDefaults(defaults, formName)
        }
        dispatch({ type: SET_KANBAN_INITIAL, payload: data })
    }
}

const onGetDimensionOrders = (source, formName, dimensionId) => {
    return async (dispatch) => {
        try {
            const response = await agent.http.KANBAN.getDimensionOrders(source, formName, dimensionId)
            if (response.status == 200) {
                dispatch({ type: SET_DIMENSION_ORDER, payload: response.data.data })
            }
            return response
        } catch {}
    }
}

const onChangeDimensionOrdersState = (dimensionOrders, dimensionId=null, formName=null) => {
    return (dispatch) => {
        if (dimensionId && formName) {
            agent.http.KANBAN.updateDimensionOrders(dimensionOrders, dimensionId, formName)
        }
        dispatch({ type: SET_DIMENSION_ORDER, payload: dimensionOrders })
    }
}

// if columnName is set get the data for a single column
const onGetKanbanData = (source, params, formName, columnName = null) => {
    return async (dispatch, getState) => {
        agent.websocket.KANBAN.recieveDataUpdated({
            formName: formName,
            callback: (data) => {
                if (data && data.user_id) {
                    const filterParams = getState().home.filter
                    const params = {
                        search_field: filterParams.search_field,
                        search_value: filterParams.search_value,
                        search_exact: filterParams.search_exact
                    }
                    try{ 
                        getKanbanData(dispatch, source, getState(), params, formName, null)
                    } catch {}
                } else {
                    makeDelay(() => {
                        const filterParams = getState().home.filter
                        const params = {
                            search_field: filterParams.search_field,
                            search_value: filterParams.search_value,
                            search_exact: filterParams.search_exact
                        }
                        try{ 
                            getKanbanData(dispatch, source, getState(), params, formName, null)
                        } catch {}
                    })
                }
            }
        })
        return getKanbanData(dispatch, source, getState(), params, formName, columnName)
    }
}


const onChangeKanbanData = (body, formName, data) => {
    return async (dispatch) => {
        try {
            const response = await agent.http.KANBAN.updateCardDimension(body, formName)
            if (response.status === 200){
                dispatch({ type: SET_DATA_KANBAN, payload: data})
                return response
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
    onRemoveCard,
    onChangeKanbanData,
    onChangeCardsState,
    onChangeDefaultState,
    onCreateOrUpdateCard,
    onGetDimensionOrders,
    onChangeDimensionOrdersState
};
