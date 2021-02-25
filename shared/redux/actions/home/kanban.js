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

/**
 * Function for retrieving the data for the kanban, since this is also fired when we recieve an event from the websockets
 * we create this function separated for the others. 
 * 
 * It's important to notice that this is a PRIVATE FUNCTION and internal to this file only, it IS NOT a redux
 * action, it's just a function for retrieving data.
 * 
 * @param {Function} dispatch - React redux dispatch function
 * @param {Object} source - This is an source object from axios so we cancel requests on the fly when unmounting components
 * @param {String} formName - The name of the formulary the user is currently in, so we retrieve the defaults for this particular form
 * @param {Object} params - All of the filtering params so we can filter the data while fetching.
 * @param {Array<String>} columnNames - We doesn't retrieve everything right away, you can retrieve in batches, and that's exactly
 * what this is for. You send an array of string where each string is the dimension phase you want to retrieve data for.
 * For example, when moving the kanban card from one phase to another you might want to retrieve the data for a single column, and so on
 * with this you can set for which columns you are retrieving data for.
 */
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


/**
 * Retrieves the defaults of the kanban, this is usually the first thing that we retrieve from the backend when loading the kanban.
 * With this we can build the kanban when the user opens the formulary for the first time.
 * 
 * So what this does is only retrieve the default kanbanCard and the default kanbanDimension to use to build the form when the kanban
 * is loaded
 * 
 * @param {Object} source - This is an source object from axios so we cancel requests on the fly when unmounting components
 * @param {String} formName - The name of the formulary the user is currently in, so we retrieve the defaults for this particular form
 */
const onGetKanbanDefaults = (source, formName) => {
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

/**
 * Retrieves the cards of the user, it's only retrieved when the user is edinting the kanban configuration.
 * 
 * @param {Object} source - An axios source object user on axios.cancelToken.source() so we can cancel a request
 * @param {String} formName - The name of the current opened formulary.
 */
const onGetCards = (source, formName) => {
    return async (dispatch) => {
        try {
            let response = await agent.http.KANBAN.getCards(source, formName)
            dispatch({ type: SET_CARDS, payload: response.data.data })
        } catch {}
    }
}

/**
 * Creates a new kanban card when editing the kanban card in the kanbanCardConfigurationForm.
 * 
 * @param {Object} body - {
 *      id: (null) - The id of the kanban card, here it's null,
 *      kanban_card_fields: [
 *          {
 *              id: (BigInteger) - The id of the field,
 *              name: (String) - The name of the field,
 *              label_name: (String) - The label_name of the field,
 *              type_id: (BigInteger) - The type_id of the field,
 *          }
 *      ]
 * }
 * @param {String} formName - The name of the current opened formulary.
 */
const onCreateKanbanCard = (body, formName) => {
    return (_) => {
        return agent.http.KANBAN.createCard(body, formName)
    }
}

/**
 * Updates an existing kanban card when editing the kanban card in the kanbanCardConfigurationForm.
 * 
 * @param {Object} body - {
 *      id: (null) - The id of the kanban card, here it's null,
 *      kanban_card_fields: [
 *          {
 *              id: (BigInteger) - The id of the field,
 *              name: (String) - The name of the field,
 *              label_name: (String) - The label_name of the field,
 *              type_id: (BigInteger) - The type_id of the field,
 *          }
 *      ]
 * }
 * @param {String} formName - The name of the current opened formulary.
 * @param {BigInteger} cardId - The id of the kanban card that you are editing.
 */
const onUpdateKanbanCard = (body, formName, cardId) => {
    return (_) => {
        return agent.http.KANBAN.updateCard(body, formName, cardId)
    }
}

/**
 * Removes a kanban card from the kanban cards list when editing the kanban, on the kanban configuration form
 * 
 * @param {Array} cards - This is exactly the cards Array of home.kanban.cards redux state key, but filtered without 
 * the kanbanCardId that was removed.
 * @param {String} formName - The name of the current opened formulary.
 * @param {BigInteger} cardId - The id of the kanban card that you are removing so we propagate this to the backend.
 */
const onRemoveCard = (cards, formName, cardId) => {
    return async (dispatch) => {
        if (cardId) {
            agent.http.KANBAN.removeCard(formName, cardId)
        }
 
        dispatch({ type: SET_CARDS, payload: cards})
    }
}

/**
 * This is called when the user changes any of the defaults, either the defaultKanbanCard
 * or the defaultDimension.
 * 
 * @param {BigInteger} defaultKanbanCardId - The id if the kanbanCard you want to use as your default
 * @param {Array<Object>} defaultKanbanCardFields - [
 *          {
 *              id: (BigInteger) - The id of the field,
 *              name: (String) - The name of the field,
 *              label_name: (String) - The label_name of the field,
 *              type_id: (BigInteger) - The type_id of the field,
 *          }
*      ]
 * @param {BigInteger} defaultDimensionFieldId - The id of the field that you want to use as the dimension for the kanban
 * @param {String} defaultDimensionFieldName -The name of the field that you want to use as the dimension for the kanban
 * @param {String} formName - The name of the current opened formulary.
 */
const onChangeDefault = (defaultKanbanCardId, defaultKanbanCardFields, defaultDimensionFieldId, defaultDimensionFieldName, formName) => {
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

/**
 * Retrieves all of the phases of a particular dimension, the phases are:
 * if i selected status in a sales pipeline formulary for example, each phase could be:
 * - Closed
 * - Deal
 * - Called
 * - Screening
 * 
 * And so on, the phases are each column of your kanban. This is used for retrieving them from our backend
 * so we can know the exact order that we need to build the kanban.
 * 
 * @param {Object} source - An axios source object user on axios.cancelToken.source() so we can cancel a request
 * @param {String} formName - The name of the current opened formulary.
 * @param {BigInteger} dimensionId - This is just a fancy name for field_id, it's the field_id you are using as dimension
 * for the kanban.
 */
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
 * Responsible for setting the dimension options shown in the screen. To improve performance, we just load
 * the data for the dimensions that are shown in screen for the user, so when the user scrolls we retrieve the data
 * for the other dimensions.
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

/**
 * When a dimension phase is deleted, renamed, moved, or created we always use this same function, for our backend
 * it's like we were editing a field only.
 * 
 * @param {Array<Object>} dimensionPhases - All of the dimension phases, this is super important because it's this list
 * we use always to create, delete or update the kanban dimension phases. If the list has one more item, you definetly created
 * a new phase, if your list is shorter than it was before you removed a phase. If the order is different then you definetly
 * moved the phases.
 * @param {BigInteger} dimensionId - The id of the dimension that you are changing, the field_id you are changing and updating
 * @param {String} formName - The name of the current opened formulary.
 */
const onChangeDimensionPhases = (dimensionPhases, dimensionId=null, formName=null) => {
    return async (dispatch) => {
        dispatch({ type: SET_DIMENSION_PHASES, payload: dimensionPhases })

        if (dimensionId && formName) {
            await agent.http.KANBAN.updateDimensionPhases(dimensionPhases, dimensionId, formName)
        }
    }
}

/**
 * Used for effectively retrieving the data for the kanban. When we retrieve the data for the kanban what we also do
 * is set a websocket connection to recieve when the data is updated in the formulary. So whenever a formulary data
 * is updated or created we also updates the kanban.
 * 
 * If it's the user who updated the formulary data, we update right away, if it's another user of the company we wait 10 minutes
 * for fetching new data.
 * 
 * @param {Object} source - An axios source object user on axios.cancelToken.source() so we can cancel a request
 * @param {Object} params - All of the filtering params so we can filter the data while fetching.
 * @param {String} formName - The name of the current opened formulary.
 * @param {Array<String>} columnNames - We doesn't retrieve everything right away, you can retrieve in batches, and that's exactly
 * what this is for. You send an array of string where each string is the dimension phase you want to retrieve data for.
 * For example, when moving the kanban card from one phase to another you might want to retrieve the data for a single column, and so on
 * with this you can set for which columns you are retrieving data for.
 */
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

/**
 * Used for collapsing dimension phases in the kanban so you kanban doesn't get bloated with lots of dimension
 * phases.
 * 
 * @param {Array<BigInteger>} collapsedDimensionIds - All of the dimension phase ids that ARE collapsed. In other words
 * each field_option_id that is collapsed in the kanban.
 */
const onCollapseDimension = (collapsedDimensionIds, formName, dimensionId) => {
    return (dispatch) => {
        agent.http.KANBAN.updateCollapsedDimensionPhases(collapsedDimensionIds.map(collapsedDimensionId => ({ field_option_id: collapsedDimensionId})), formName, dimensionId)
        dispatch({type: SET_DIMENSION_COLLAPSED, payload: collapsedDimensionIds })
    }
}

/**
 * Retrieves all of the collapsed dimensions
 * 
 * @param {Object} source - An axios source object user on axios.cancelToken.source() so we can cancel a request
 * @param {BigInteger} dimensionId - The id of the dimension that you are changing, the field_id you are changing and updating
 * @param {String} formName - The name of the current opened formulary.
 */
const onGetCollapsedDimensionPhases = (source, formName, dimensionId) => {
    return async (dispatch) => {
        return agent.http.KANBAN.getCollapsedDimensionPhases(source, formName, dimensionId).then(response => {
            let collapsedDimensionIds = []
            if (response && response.status === 200) {
                collapsedDimensionIds = response.data.data.map(collapsed => collapsed.field_option_id)
                dispatch({type: SET_DIMENSION_COLLAPSED, payload: collapsedDimensionIds })
            }
            return collapsedDimensionIds
        })
    }
}

/**
 * When the user moves the kanban card from one dimension phase to another, basically the main functionality
 * of every kanban: be able to drag a kanban card from one column and drop it in another column.
 * 
 * @param {} body - {
 *      new_value: (String) - The name of the new dimension where the card is going,
 *      form_value_id: (BigInteger) - The id of the form_value that you are changing, each value of the formulary is a form_value
 *                                     this is the id of this form_value
 * }
 * @param {String} formName - The name of the current page.
 * @param {Object} data - The actual data of the kanban, this is used so we can change the data directly from the kanban and the front end
 * without needing to retrieve new data from the backend.
 */
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
    onGetCollapsedDimensionPhases,
    onCollapseDimension,
    onGetKanbanDefaults,
    onGetKanbanFields,
    onGetCards,
    onGetKanbanData,
    onRemoveCard,
    onMoveKanbanCardBetweenDimensions,
    onChangeDefault,
    onChangeDimensionsToShow,
    onCreateKanbanCard,
    onUpdateKanbanCard,
    onGetDimensionPhases,
    onChangeDimensionPhases
}
