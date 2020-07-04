import {
    GET_LISTING_DATA,
    SET_HEADERS,
    SET_TOTALS
} from '../../types';
import agent from '../../../utils/agent'

const getListingData = async (dispatch, source, state, params, formName) => {
    let stateData = state.home.list.data
    let payload = {
        pagination: stateData.pagination,
        data: stateData.data
    }

    let response = await agent.http.LISTING.getData(source, params, formName)
    if (response && response.status === 200) {
        payload.pagination = response.data.pagination

        if (params.page === 1) {
            payload.data = response.data.data
        } else {
            payload.data = payload.data.concat(response.data.data)
        }

        dispatch({ type: GET_LISTING_DATA, payload: payload })
    }
    return response
}


const onGetListingData = (source, params, formName) => {
    return async (dispatch, getState) => {
        agent.websocket.LISTING.recieveDataUpdated({
            formName: formName,
            callback: (data) => {
                const filterParams = getState().home.filter
                const params = {
                    ...filterParams,
                    page: 1
                }
                try {
                    getListingData(dispatch, source, getState(), params, formName)
                } catch {}
            }
        })
        return await getListingData(dispatch, source, getState(), params, formName)
    }
}

const onGetExportedData = (fileId) => {
    return async (_) => {
        let response = await agent.http.LISTING.getHasExportedData(fileId) 
        if (response.data.status === 'ok') {
            agent.http.LISTING.getHasExportedData(fileId, true)
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
        agent.http.LISTING.removeData(formName, formId)
        dispatch({ type: GET_LISTING_DATA, payload: payload })
    }
}

const onExportData = (params, formName) => {
    return (_) => {
        return agent.http.LISTING.exportData(params, formName) 
    }
}

const onRenderListing = (source, formName) => {
    return async (dispatch) => {
        let response = await agent.http.LISTING.getRenderData(source, formName)
        if (response && response.status === 200) {
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
        try {
            let response = await agent.http.LISTING.getTotals(params, formName)
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
        agent.http.LISTING.createTotal(body, formName)
    }
}

const onRemoveTotal = (formName, totalId) => {
    return (_) => {
        agent.http.LISTING.removeTotal(formName, totalId)
    }
}

const onUpdateSelected = (body, formName) => {
    return async (_) => {
        agent.http.LISTING.updateSelectedFields(body, formName)
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
