import { SET_NOTIFY } from '../types';

const initialState = {
    notification: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_NOTIFY:
            return {
                notification: action.payload
            }
        
        default:
            return state;
    }
};