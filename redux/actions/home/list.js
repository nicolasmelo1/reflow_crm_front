import {
    GET_DATA,
    GET_HEADERS,
    GET_TOTALS
} from 'redux/types';
import agent from 'redux/agent'
import { UPDATE_HEAD_SELECT } from '../../types';


const onGetData = (params, formName) => {
    return async (dispatch) => {
        let response = await agent.LISTING.getData(params, formName)

        dispatch({ type: GET_DATA, payload: response.data });
    }
}

const onGetHeader = (formName) => {
    return async (dispatch) => {
        let response = await agent.LISTING.getHeader(formName)

        dispatch({ type: GET_HEADERS, payload: response.data });
    }
}
const onGetTotal = (formName) => {
    return async (dispatch) => {
        let response = await agent.LISTING.getTotals(formName)

        dispatch({ type: GET_TOTALS, payload: response.data })
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
    onGetHeader,
    onGetTotal,
    onUpdateSelected
};
