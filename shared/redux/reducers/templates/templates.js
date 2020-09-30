import { SET_SELECT_TEMPLATES, SET_SELECT_TEMPLATE_DATA, SET_UPDATE_TEMPLATE_DATA, SET_UPDATE_TEMPLATE_DEPENDS_ON } from '../../types';

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
    },
    update: {
        data: {
            pagination: {
                current: 0,
                total: 0
            },
            data: []
        },
        depends_on: {}
    }
}

const templatesReducer = (state = initialState, action) => {
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
        case SET_UPDATE_TEMPLATE_DATA:
            return {
                ...state,
                update: {
                    ...state.update,
                    data: action.payload
                }
            }
        case SET_UPDATE_TEMPLATE_DEPENDS_ON:
            return {
                ...state,
                update: {
                    ...state.update,
                    depends_on: action.payload
                }
            }
        default:
            return state;
    }
}

export default templatesReducer