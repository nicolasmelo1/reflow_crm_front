import { SET_AUTOMATION_APPS } from '../../types'
import agent from '../../../utils/agent'

/**
 * Retrieves the automation apps with it's triggers and actions.
 * 
 * @param {Object} source - An axios source used for cancelling the api call. 
 * @returns {function} - This is required for redux, nothing much to add.
 */
const onGetAutomationApps = (source) => {
    return (dispatch) => { 
        agent.http.AUTOMATION.settingsLoadApps(source).then(response => {
            if (response.status === 200) {
                dispatch({ type: SET_AUTOMATION_APPS, payload: response.data.data})
            }
        })
    }
}

/**
 * Retrieve the input formulary data for an app from an inputFormulary instance id.
 * 
 * @param {Object} source - An axios source used for cancelling the api call. 
 * @param {Integer} inputFormularyId - A Input Formulary instance id.
 * 
 * @returns {Promise} - returns a promise with the data retrieve from the request
 */
const onGetInputFormulary = (source, inputFormularyId) => {
    return async (_) => await agent.http.AUTOMATION.settingsGetInputFormulary(source, inputFormularyId)
}


export default { 
    onGetAutomationApps,
    onGetInputFormulary
}