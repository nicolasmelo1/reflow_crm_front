import { GET_FORMS } from '../types';

export default (state=[], action) => {
    switch (action.type) {
        case GET_FORMS:
            return action.payload.data;
        default:
            return state;
    }
};