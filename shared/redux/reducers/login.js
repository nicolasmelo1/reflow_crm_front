import { AUTHENTICATE, DATA_TYPES, SET_USER, SET_PRIMARY_FORM } from '../types';

const initialState = {
    companyId: null,
    primaryForm: null,
    dateFormat: 'DD/MM/YYYY HH:mm:ss',
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
        case SET_PRIMARY_FORM:
            return {
                ...state,
                primaryForm: action.payload
            }
        case DATA_TYPES:
            console.log(action.payload)
            return { 
                ...state,
                types: action.payload
            }
        default:
            return state;
    }
};