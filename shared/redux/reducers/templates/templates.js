import { SET_SELECT_TEMPLATES, SET_SELECT_TEMPLATE_DATA } from '../../types';

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
    },
    loadedTemplate: {
        display_name: '',
        description: '',
        theme_form: []
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECT_TEMPLATES:
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
        case SET_SELECT_TEMPLATE_DATA:
            return {
                ...state,
                loadedTemplate: action.payload
            }
        default:
            return state;
    }
}