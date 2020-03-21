import {
    GET_DATA,
    SET_HEADERS,
    SET_TOTALS
} from 'redux/types';
import agent from 'redux/agent'


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
            dispatch({ type: SET_HEADERS, payload: response.data.data });
        }
    }
}

const onUpdateHeader = (header) => {
    return (dispatch) => {
        dispatch({type: SET_HEADERS, payload: header})
    }
}

const onGetTotals = (params, formName) => {
    return async (dispatch) => {
        let response = await agent.LISTING.getTotals(params, formName)
        if (response.status === 200) {
            dispatch({ type: SET_TOTALS, payload: response.data.totals })
        }
    }
}

const onUpdateTotals = (totalsData) => {
    return async (dispatch) => {
        dispatch({type: SET_TOTALS, payload: totalsData})
    }
}

const onCreateTotal = (body, formName) => {
    return async (_) => {
        agent.LISTING.createTotal(body, formName)
    }
}

const onRemoveTotal = (formName, totalId) => {
    return (_) => {
        agent.LISTING.removeTotal(formName, totalId)
    }
}

const onUpdateSelected = (body, formName) => {
    return async (_) => {
        agent.LISTING.updateSelectedFields(body, formName)
    }
}

export default {
    onGetData,
    onExportData,
    onGetExportedData,
    onGetHeader,
    onUpdateHeader,
    onGetTotals,
    onUpdateTotals,
    onRemoveTotal,
    onCreateTotal,
    onUpdateSelected
};
