import { SET_COMPANY, SET_UPDATE_COMPANY } from '../types'

const initialState = {
    id: null, 
    endpoint: '',
    name: '',
    logo_image_url: '',
    is_active: true, 
    is_supercompany: false, 
    is_paying_company: false,
    free_trial_days: 30,
    created_at: null,
    update: {
        name: '',
        endpoint: '',
        logo_image_url: ''
    }
}

const companyReducer = (state=initialState, action) => {
    switch (action.type) {
        case SET_COMPANY:
            return {
                ...state,
                ...action.payload
            }
        case SET_UPDATE_COMPANY:
            return {
                ...state,
                update: action.payload
            }
        default:
            return state
    }
}

export default companyReducer