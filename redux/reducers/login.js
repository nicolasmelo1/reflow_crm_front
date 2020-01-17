import { AUTHENTICATE } from '../types';

const initialState = {
    companyId: null,
    primaryForm: null,
    user: null,
    company: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            window.localStorage.setItem('token', action.payload.access_token)
            window.localStorage.setItem('refreshToken', action.payload.refresh_token)

            return Object.assign({}, state, { 
                companyId: action.payload.company_id, 
                primaryForm: action.payload.form_name
            });
        default:
            return state;
    }
};