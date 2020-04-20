import { AUTHENTICATE, DATA_TYPES, SET_USER } from '../types';

const initialState = {
    companyId: null,
    primaryForm: null,
    user: null,
    company: null,
    types: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return { 
                ...state,
                companyId: action.payload.company_id, 
                primaryForm: action.payload.form_name,
                user: action.payload.user
            }
        case SET_USER: 
            return { 
                ...state,
                user: action.payload
            }
        case DATA_TYPES:
            return { 
                ...state,
                types: action.payload
            }
        default:
            return state;
    }
};