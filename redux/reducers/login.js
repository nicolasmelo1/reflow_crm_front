import { AUTHENTICATE, DATA_TYPES } from '../types';

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
            window.localStorage.setItem('token', action.payload.access_token)
            window.localStorage.setItem('refreshToken', action.payload.refresh_token)

            return { 
                ...state,
                companyId: action.payload.company_id, 
                primaryForm: action.payload.form_name
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