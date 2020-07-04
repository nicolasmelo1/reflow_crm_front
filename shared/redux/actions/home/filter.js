

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
                state.search_value.push(searchInstance.searchValue)
                state.search_field.push(searchInstance.searchField)
                state.search_exact.push(0)
            }
        })
        dispatch({ type: SET_FILTER_SEARCH, payload: payload })
    }
}