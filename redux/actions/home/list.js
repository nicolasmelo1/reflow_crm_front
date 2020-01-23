import {
    GET_DATA
} from 'redux/types';
import agent from 'redux/agent'

const onGetData = (params, formName) => {
    return async (dispatch) => {
        let response = await agent.LISTING.getData(params, formName)
        console.log(response)
        dispatch({ type: GET_DATA, payload: response.data });
    }
}

const onGetHeader = (formName) => {
    return async (dispatch) => {
        let response = await agent.LISTING.getHeader(formName)
        console.log(response)
        dispatch({ type: GET_HEADER, payload: response.data });
    }
}

export default {
    onGetData,
    onGetHeader
};
