import { SET_TEMPLATES } from '../../types';

let initialState = {
    data: {
        reflow: {
            pagination: {
                current: 0
            },
            data: []
        },
        community: {
            pagination: {
                current: 0
            },
            data: []
        },
        company: {
            pagination: {
                current: 0
            },
            data: []
        },
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_TEMPLATES:
            return {
                ...state,
                data:{
                    ...state.data,
                    [action.payload.filter]: {
                        pagination: {
                            current: action.payload.page
                        },
                        data: action.payload.data
                    }
                }
            }
                
        default:
            return state;
    }
}