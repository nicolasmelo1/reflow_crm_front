import { SET_FILTER_SORT, SET_FILTER_SEARCH } from '../../types'

/**
 * Sets the search values on the filter redux instance
 * By default this function is only used when searching for approximate values not exact, that's why
 * you don't set the searchExact
 * 
 * @param {Array<Object>} searchInstances - Array of objects containing the following keys:
 * `searchValue`, `searchField` like this following example:
 * {
 *      searchValue: 'Teste',
 *      searchField: 'markettype',
 * }
 */
const onSetSearch = (searchInstances) => {
    return (dispatch) => {
        let payload = {
            search_value: [],
            search_field: [],
            search_exact: []
        }
        // this always creates the objects again on the array, we don't update each item on
        // the array individually.
        searchInstances.forEach(searchInstance => {
            if (searchInstance.searchValue !== '' && searchInstance.searchField !== '') {
                payload.search_value.push(searchInstance.searchValue)
                payload.search_field.push(searchInstance.searchField)
                payload.search_exact.push(0)
            }
        })
        dispatch({ type: SET_FILTER_SEARCH, payload: payload })

        return payload
    }
}

const onSetSort = (fieldName, value) => {
    return (dispatch, getState) => {
        const state = getState().home.filter
        
        let payload = {
            sort_field: state.sort_field,
            sort_value: state.sort_value
        }

        if (!fieldName || !value) {
            throw new SyntaxError("onSort() function should recieve a fieldName and a value")
        } 
        if (value && !['down', 'upper', 'none'].includes(value)) {
            throw new SyntaxError("value parameter MUST be one of the both: `upper`, `down` or `none` ")
        }
        if (value === '' || value === 'none') {
            const indexToRemove = state.sort_field.findIndex(sortField=> sortField === fieldName)
            payload.sort_value.splice(indexToRemove, 1)
            payload.sort_field.splice(indexToRemove, 1)
        } else {
            const indexToUpdate = state.sort_field.findIndex(sortField=> sortField === fieldName)
            if (indexToUpdate !== -1) {
                payload.sort_value[indexToUpdate] = value
                payload.sort_field[indexToUpdate] = fieldName
            } else {
                payload.sort_value.push(value)
                payload.sort_field.push(fieldName)
            }
        }
        dispatch({ type: SET_FILTER_SORT, payload: payload })

        return payload
    }
}

export default {
    onSetSearch,
    onSetSort
}