import {
    SET_DATA_KANBAN,
    SET_DIMENSION_PHASES,
    SET_DIMENSION_IN_SCREEN,
    SET_KANBAN_DEFAULT_DATA,
    SET_KANBAN_FIELDS,
    SET_CARDS,
    SET_DIMENSION_COLLAPSED
} from '../../types';
import agent from '../../../utils/agent'
import delay from '../../../utils/delay'
import isEqual from '../../../utils/isEqual'

const makeDelay = delay(10000)

let retrievingDataForColumns = []

const getKanbanData = async (dispatch, source, state, params, formName, columnNames=[]) => {
    const dimensionOptionNames = state.home.kanban.dimension.phases.map(dimension => dimension.option)
    const shownInScreenDimensionNames = state.home.kanban.dimension.inScreenDimensions.map(dimensionOrder=> dimensionOrder.option)
    const initial = state.home.kanban.initial
    const data = state.home.kanban.data

    let payload = []
    const isLoadingNewData = columnNames.length === 0
    const isNotRetrivingColumnNamesOrIsLoadingNewData = columnNames.filter(columnName => !retrievingDataForColumns.includes(columnName)).length > 0 || isLoadingNewData
    const areDefaultsDefined = initial.defaultKanbanCard.id !== null && initial.defaultDimensionField.id !== null
    
    if (isNotRetrivingColumnNamesOrIsLoadingNewData) {
        // we are loading new data 
        if (isLoadingNewData) {
            payload = data.filter(dimensionData => shownInScreenDimensionNames.includes(dimensionData.dimension))
            dispatch({ type: SET_DATA_KANBAN, payload: payload})
        } else {
            payload = data
        }
        
        let response = null

        if (areDefaultsDefined) {
            columnNames = (isLoadingNewData) ? shownInScreenDimensionNames : columnNames
            retrievingDataForColumns = retrievingDataForColumns.concat(columnNames)

            const cardFieldIds = initial.defaultKanbanCard.kanbanCardFields.map(field=> field.field.id).concat(initial.defaultDimensionField.id)
            const defaultParameters = {
                search_exact: params.search_exact.concat(1),
                search_field: params.search_field.concat(initial.defaultDimensionField.name),
                fields: cardFieldIds,
            }
            const promises = columnNames.map(async (columnName) => {
                if (columnName !== '') {
                    const parameters = {
                        ...defaultParameters,
                        page: (params.page) ? params.page : 1,
                        search_value: params.search_value.concat(columnName),
                    }
                    response = await agent.http.KANBAN.getData(source, parameters, formName)
                    if (response && response.status === 200) {
                        const dimensionIndexInData = payload.findIndex(dimensionData => dimensionData.dimension === columnName)
                        if (dimensionIndexInData !== -1) {
                            if (payload[dimensionIndexInData].pagination.current === response.data.pagination.current) {
                                payload[dimensionIndexInData].data = response.data.data
                            } else {
                                payload[dimensionIndexInData].data = data[dimensionIndexInData].data.concat(response.data.data)
                            }
                            payload[dimensionIndexInData].pagination = response.data.pagination
                            payload = [...payload]
                        } else {
                            payload.push({
                                dimension: columnName, 
                                pagination: response.data.pagination,
                                data: response.data.data
                            })
                        }
                    }
                }
            })
            await Promise.all(promises)
            if (response && response.status === 200) {
                //Filter payload with the possible fields
                payload = payload.filter(columnData => dimensionOptionNames.includes(columnData.dimension))
                dispatch({ type: SET_DATA_KANBAN, payload: payload})
            }   
        }
    }
    retrievingDataForColumns = retrievingDataForColumns.filter(retrieveDataForColumn => !columnNames.includes((retrieveDataForColumn)))

    return payload
}


const onRenderKanban = (source, formName) => {
    return (dispatch, getState) => {
        return agent.http.KANBAN.getDefaultDimensionAndKanbanCard(source, formName).then(response => {
            const defaultKanbanCardId = getState().home.kanban.initial.defaultKanbanCard.id
            const defaultDimensionId = getState().home.kanban.initial.defaultDimensionField.id

            if (response && response.status === 200) {
                const payload = {
                    defaultKanbanCard: {
                        id: response.data.data.kanban_card ? response.data.data.kanban_card.id : null,
                        kanbanCardFields: response.data.data.kanban_card ? response.data.data.kanban_card.kanban_card_fields : []
                    },
                    defaultDimensionField: {
                        id: response.data.data?.kanban_dimension ? response.data.data?.kanban_dimension?.id : null,
                        name: response.data.data?.kanban_dimension ? response.data.data?.kanban_dimension?.name : null
                    }
                }
                dispatch({ type: SET_KANBAN_DEFAULT_DATA, payload: payload})
                if (defaultDimensionId !== payload.defaultDimensionField.id || defaultKanbanCardId !== payload.defaultKanbanCard.id) {
                    dispatch({ type: SET_DATA_KANBAN, payload: []})        
                }
            }
            return response
        })
    }
}

/**
 * Retrieves the possible fields that the user can select when creating or editing a kanban. This loads all of the fields in the dimension the user can select
 * and all of the fields the user can select for the items in the kanban card
 * 
 * @param {Object} source - An axios source object user on axios.cancelToken.source() so we can cancel a request
 * @param {String} formName - The name of the current opened formulary.
 */
const onGetKanbanFields = (source, formName) => {
    return (dispatch) => {
        return agent.http.KANBAN.getDimensionAndCardFields(source, formName).then(response => {
            if (response && response.status === 200) {
                const payload = {
                    fieldsForDimension: response.data.data.dimension_fields,
                    fieldsForCard: response.data.data.fields
                }
                dispatch({ type: SET_KANBAN_FIELDS, payload: payload})
            }
            return response
        })
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

const onCreateKanbanCard = (body, formName) => {
    return (_) => {
        return agent.http.KANBAN.createCard(body, formName)
    }
}

const onUpdateKanbanCard = (body, formName, cardId) => {
    return (_) => {
        return agent.http.KANBAN.updateCard(body, formName, cardId)
    }
}

const onRemoveCard = (cards, formName, cardId) => {
    return async (dispatch) => {
        if (cardId) {
            agent.http.KANBAN.removeCard(formName, cardId)
        }
 
        dispatch({ type: SET_CARDS, payload: cards})
    }
}

const onChangeDefaultState = (defaultKanbanCardId, defaultKanbanCardFields, defaultDimensionFieldId, defaultDimensionFieldName, formName) => {
    return (dispatch) => {
        const payload = {
            defaultKanbanCard: {
                id: defaultKanbanCardId,
                kanbanCardFields: defaultKanbanCardFields
            },
            defaultDimensionField: {
                id: defaultDimensionFieldId,
                name: defaultDimensionFieldName
            }
        }
        agent.http.KANBAN.updateDefault({
            kanban_card: {
                id: defaultKanbanCardId,
                kanban_card_fields: defaultKanbanCardFields
            },
            kanban_dimension: {
                id: defaultDimensionFieldId,
                name: defaultDimensionFieldName
            }
        }, formName)
        dispatch({ type: SET_KANBAN_DEFAULT_DATA, payload: payload})
    }
}

const onGetDimensionPhases = (source, formName, dimensionId) => {
    return async (dispatch) => {
        try {
            const response = await agent.http.KANBAN.getDimensionPhases(source, formName, dimensionId)
            if (response.status == 200) {
                dispatch({ type: SET_DIMENSION_PHASES, payload: response.data.data })
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
 * @param {Array<Object>} dimensionsOnScreen - Array of unfiltered dimension.phases, this array represents the dimensions that
 * is on the screen at the current time but are not filtered, they could be collapsed.
 */
const onChangeDimensionsToShow = (dimensionsOnScreen) => {
    return (dispatch, getState) => {
        const dimensionsShown = getState().home.kanban.dimension.inScreenDimensions
        
        if (!isEqual(dimensionsShown, dimensionsOnScreen)) {
            dispatch({ type: SET_DIMENSION_IN_SCREEN, payload: dimensionsOnScreen })
        }
    }
}

const onChangeDimensionPhases = (dimensionPhases, dimensionId=null, formName=null) => {
    return async (dispatch) => {
        dispatch({ type: SET_DIMENSION_PHASES, payload: dimensionPhases })

        if (dimensionId && formName) {
            await agent.http.KANBAN.updateDimensionPhases(dimensionPhases, dimensionId, formName)
        }
    }
}

// if columnName is set get the data for a single column
const onGetKanbanData = (source, params, formName, columnNames=[]) => {
    return async (dispatch, getState) => {
        agent.websocket.KANBAN.recieveDataUpdated({
            formName: formName,
            callback: (data) => {
                const hasCurrentUserMadeChanges = data && data.data && data.data.user_id && data.data.user_id === getState().login.user.id
                if (hasCurrentUserMadeChanges) {
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

            }
        })
        return getKanbanData(dispatch, source, getState(), params, formName, columnNames)
    }
}

const onCollapseDimension = (collapsedDimensionIds) => {
    return (dispatch) => {
        dispatch({type: SET_DIMENSION_COLLAPSED, payload: collapsedDimensionIds })
    }
}

const onMoveKanbanCardBetweenDimensions = (body, formName, data) => {
    return async (dispatch) => {
        try {
            const response = await agent.http.KANBAN.updateCardDimension(body, formName)
            if (response && response.status === 200){
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
    onCollapseDimension,
    onRenderKanban,
    onGetKanbanFields,
    onGetCards,
    onGetKanbanData,
    onRemoveCard,
    onMoveKanbanCardBetweenDimensions,
    onChangeDefaultState,
    onChangeDimensionsToShow,
    onCreateKanbanCard,
    onUpdateKanbanCard,
    onGetDimensionPhases,
    onChangeDimensionPhases
};
