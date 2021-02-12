import {
    SET_DATA_KANBAN,
    SET_DIMENSION_ORDER,
    SET_DIMENSION_IN_SCREEN,
    SET_KANBAN_INITIAL,
    SET_KANBAN_IGNORE_WEBSOCKET,
    SET_CARDS
} from '../../types';
import agent from '../../../utils/agent'
import delay from '../../../utils/delay'


const makeDelay = delay(10000)


const getKanbanData = async (dispatch, source, state, params, formName, columnNames=[]) => {
    const initial = state.home.kanban.initial
    const cards = state.home.kanban.cards
    const card = cards.filter(card => card.id === initial?.default_kanban_card_id)[0]
    const data = state.home.kanban.data
    
    let payload = []
    // we are loading new data 
    if (columnNames.length === 0) {
        const onScreenDimensionNames = state.home.kanban.dimension.inScreenDimensions.map(dimensionOrder=> dimensionOrder.options)
        payload = data.filter(dimensionData => onScreenDimensionNames.includes(dimensionData.dimension))
        dispatch({ type: SET_DATA_KANBAN, payload: payload})
    } else {
        payload = data
    }
    
    let response = null

    if (initial.default_kanban_card_id && initial.default_dimension_field_id && card) {
        columnNames = (columnNames.length === 0) ? state.home.kanban.dimension.inScreenDimensions.map(dimensionOrder=> dimensionOrder.options) : columnNames
        
        const dimension = initial.fields.filter(field=> field.id === initial.default_dimension_field_id)
        const cardFieldIds = card.kanban_card_fields.map(field=> field.id).concat(dimension[0].id)
        const defaultParameters = {
            search_exact: params.search_exact.concat(1),
            search_field: params.search_field.concat(dimension[0].name),
            fields: cardFieldIds,
        }
        const promises = columnNames.map(async (columnName) => {
            const parameters = {
                ...defaultParameters,
                page: (params.page) ? params.page : 1,
                search_value: params.search_value.concat(columnName),
            }
            response = await agent.http.KANBAN.getData(source, parameters, formName)
            if (response && response.status === 200) {
                const dimensionIndexInData = payload.findIndex(dimensionData => dimensionData.dimension === columnName)
                if (dimensionIndexInData !== -1) {
                    payload[dimensionIndexInData].pagination = response.data.pagination
                    if (payload[dimensionIndexInData].pagination.current === response.data.pagination.current) {
                        payload[dimensionIndexInData].data = response.data.data
                    } else {
                        payload[dimensionIndexInData].data = data[dimensionIndexInData].data.concat(response.data.data)
                    }
                    payload = [...payload]
                } else {
                    payload.push({
                        dimension: columnName, 
                        pagination: response.data.pagination,
                        data: response.data.data
                    })
                }
            }
        })
        await Promise.all(promises)
        if (response && response.status === 200) {
            dispatch({ type: SET_DATA_KANBAN, payload: payload})
        }
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
            return response.data.data
        } catch {
            return []
        }
    }
}

/**
 * Responsible for setting the dimension options shown in the screen.
 * 
 * @param {Object} source - Axios source so we can cancel the request on the fly.
 * @param {String} formName - The current formName, we use this to retrieve new data.
 * @param {Array<Object>} dimensionsToLoad - Array of filtered dimension.orders, this array represents the dimensions that
 * is on the screen at the current time.
 * @param {Boolean} isInitial - If you are loading this when mounting the component you DO NOT NEED to retrieve the data,
 * the component will be responsible for it. Otherwise we need to retrieve the kanban data for the new columns
 */
const onChangeDimensionsToShow = (source, formName, dimensionsToLoad, isInitial=true) => {
    return async (dispatch, getState) => {
        if (isInitial) {
            dispatch({ type: SET_DIMENSION_IN_SCREEN, payload: dimensionsToLoad })
        } else {
            const loadedDimensions = getState().home.kanban.data
            const dimensionNamesShownInScreen = loadedDimensions.map(dimension => dimension.dimension)
            let dimensionsNamesToLoad = dimensionsToLoad.map(dimension => dimension.options)
            dimensionsNamesToLoad = dimensionsNamesToLoad.filter(dimensionName => !dimensionNamesShownInScreen.includes(dimensionName))
            
            const filterParams = getState().home.filter
            const params = {
                search_field: filterParams.search_field,
                search_value: filterParams.search_value,
                search_exact: filterParams.search_exact
            }
            dispatch({ type: SET_DIMENSION_IN_SCREEN, payload: dimensionsToLoad })
            if (dimensionsNamesToLoad.length > 0) {
                await getKanbanData(dispatch, source, getState(), params, formName, dimensionsNamesToLoad)
            }
        }
        return true
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
const onGetKanbanData = (source, params, formName, columnNames=[]) => {
    return async (dispatch, getState) => {
        agent.websocket.KANBAN.recieveDataUpdated({
            formName: formName,
            callback: (data) => {
                if (!getState().home.kanban.ignoreWebSocket) {
                    if (data && data.data && data.data.user_id && data.data.user_id === getState().login.user.id) {
                        const filterParams = getState().home.filter
                        const params = {
                            search_field: filterParams.search_field,
                            search_value: filterParams.search_value,
                            search_exact: filterParams.search_exact
                        }
                        try{ 
                            getKanbanData(dispatch, source, getState(), params, formName, [])
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
                                getKanbanData(dispatch, source, getState(), params, formName, [])
                            } catch {}
                        })
                    }
                } else {
                    dispatch({ type: SET_KANBAN_IGNORE_WEBSOCKET, payload: false})
                }
            }
        })
        return getKanbanData(dispatch, source, getState(), params, formName, columnNames)
    }
}


const onChangeKanbanData = (body, formName, data) => {
    return async (dispatch) => {
        try {
            dispatch({ type: SET_KANBAN_IGNORE_WEBSOCKET, payload: true})
            const response = await agent.http.KANBAN.updateCardDimension(body, formName)
            if (response && response.status === 200){
                dispatch({ type: SET_DATA_KANBAN, payload: data})
                return response
            } else {
                dispatch({ type: SET_KANBAN_IGNORE_WEBSOCKET, payload: false})

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
    onChangeDimensionsToShow,
    onCreateOrUpdateCard,
    onGetDimensionOrders,
    onChangeDimensionOrdersState
};
