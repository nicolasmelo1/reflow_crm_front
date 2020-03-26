import {
    GET_DATA,
    SET_HEADERS,
    SET_TOTALS
} from 'redux/types';
import agent from 'redux/agent'


const onGetListingData = (params, formName) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.list.data
        let payload = []
        let response = await agent.LISTING.getData(params, formName)

        if (params.page === 1) {
            payload = response.data.data
        } else {
            payload = stateData.concat(response.data.data)
        }

        dispatch({ type: GET_DATA, payload: payload });

        return response
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

const onRenderListing = (formName) => {
    return async (dispatch) => {
        let response = await agent.LISTING.getRenderData(formName)
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
    onGetListingData,
    onExportData,
    onGetExportedData,
    onRenderListing,
    onUpdateHeader,
    onGetTotals,
    onUpdateTotals,
    onRemoveTotal,
    onCreateTotal,
    onUpdateSelected
};
