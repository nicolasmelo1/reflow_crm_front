
import { ERROR } from '../types';

// gets token from the api and stores it in the redux store and in cookie
const cleanErrors = () => {
    return async (dispatch) => {
        dispatch({type: ERROR, payload: {}});
    };
};

export default {
    cleanErrors
};