import {
    GET_DATA,
    GET_HEADERS,
    GET_TOTALS
} from 'redux/types';
import agent from 'redux/agent'
import { UPDATE_HEAD_SELECT } from 'redux/types';


const onGetData = (params, formName) => {
    return async (dispatch) => {
        let response = await agent.LISTING.getData(params, formName)

        dispatch({ type: GET_DATA, payload: response.data });
    }
}

const onGetExportedData = () => {
    return async (_) => {
        let response = await agent.LISTING.getHasExportedData() 
        if (response.data.status === 'ok') {
            response = await agent.LISTING.getHasExportedData(true)
            return response
        }
        return response
    }
}

const onExportData = (params, formName) => {
    return async (_) => {
        return await agent.LISTING.exportData(params, formName) 
    }
}

const onGetHeader = (formName) => {
    return async (dispatch) => {
        let response = await agent.LISTING.getHeader(formName)
        if (response.status === 200) {
            dispatch({ type: GET_HEADERS, payload: response.data });
        }
    }
}
const onGetTotal = (params, formName) => {
    return async (dispatch) => {
        let response = await agent.LISTING.getTotals(params, formName)
        if (response.status === 200) {
            dispatch({ type: GET_TOTALS, payload: response.data })
        }
    }
}

const onUpdateSelected = (index, formName) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.list.header.field_headers
        stateData[index].user_selected = !stateData[index].user_selected
        const fields = {
            fields: stateData.filter(head => head.user_selected).map((head, index) => {
                return head.name
            })
        }

        agent.LISTING.updateSelectedFields(fields, formName)
        dispatch({ type: UPDATE_HEAD_SELECT, payload: stateData })
    }
}


export default {
    onGetData,
    onExportData,
    onGetExportedData,
    onGetHeader,
    onGetTotal,
    onUpdateSelected
};
