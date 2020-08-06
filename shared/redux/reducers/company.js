import { SET_COMPANY } from '../types'

const initialState = {
    id: null, 
    endpoint: '',
    name: '',
    is_active: true, 
    is_supercompany: false, 
    is_paying_company: false,
    free_trial_days: 30,
    created_at: null
}

export default (state=initialState, action) => {
    switch (action.type) {
        case SET_COMPANY:
            return {
                id: action.payload.id, 
                endpoint: action.payload.endpoint,
                name: action.payload.name,
                is_active: action.payload.is_active, 
                is_supercompany: action.payload.is_supercompany, 
                is_paying_company: action.payload.is_paying_company,
                free_trial_days: action.payload.free_trial_days,
                created_at: action.payload.created_at
            }
        default:
            return state
    }
}