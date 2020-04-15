import {
    GET_DATA,
    SET_HEADERS,
    SET_TOTALS
} from '../../types';
import agent from '../../agent'


const onGetListingData = (source, params, formName) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.list.data
        let payload = {
            pagination: stateData.pagination,
            data: stateData.data
        }

        try {
            let response = await agent.LISTING.getData(source, params, formName)
            payload.pagination = response.data.pagination
            if (params.page === 1) {
                payload.data = response.data.data
            } else {
                payload.data = payload.data.concat(response.data.data)
            }
            dispatch({ type: GET_DATA, payload: payload })
            return response

        } catch {}
    }
}

const onGetExportedData = () => {
    return async (_) => {
        let response = await agent.LISTING.getHasExportedData() 
        if (response.data.status === 'ok') {
            agent.LISTING.getHasExportedData(true)
        }
        return response
    }
}

const onRemoveData = (data, formName, formId) => {
    return (dispatch, getState) => {
        const state = getState().home.list.data
        const payload = {
            ...state,
            data: data
        }
        agent.LISTING.removeData(formName, formId)
        dispatch({ type: GET_DATA, payload: payload })
    }
}

const onExportData = (params, formName) => {
    return async (_) => {
        return await agent.LISTING.exportData(params, formName) 
    }
}

const onRenderListing = (source, formName) => {
    return async (dispatch) => {
        try {
            let response = await agent.LISTING.getRenderData(source, formName)
            if (response.status === 200) {
                dispatch({ type: SET_HEADERS, payload: response.data.data });
            }
        } catch {}
    }
}

const onUpdateHeader = (header) => {
    return (dispatch) => {
        dispatch({type: SET_HEADERS, payload: header})
    }
}

const onGetTotals = (params, formName) => {
    return async (dispatch) => {
        try {
            let response = await agent.LISTING.getTotals(params, formName)
            if (response.status === 200) {
                dispatch({ type: SET_TOTALS, payload: response.data.totals })
            }
        } catch {}
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
    onRemoveData,
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
