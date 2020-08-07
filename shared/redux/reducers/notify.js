import { SET_NOTIFY } from '../types';

const initialState = {
    notification: []
}

const notifyReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_NOTIFY:
            return {
                notification: action.payload
            }
        
        default:
            return state;
    }
}

export default notifyReducer