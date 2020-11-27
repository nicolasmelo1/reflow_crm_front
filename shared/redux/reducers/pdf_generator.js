import { SET_PDF_GENERATOR_FORMULARY_OPTIONS, SET_PDF_GENERATOR_CREATOR_TEMPLATES } from '../types';

const initialState = {
    creator: {
        templates: []
    }
}

const pdfGeneratorReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PDF_GENERATOR_CREATOR_TEMPLATES:
            return {
                ...state,
                creator: {
                    ...state.creator,
                    templates: action.payload
                }
            }
        default:
            return state;
    }
}

export default pdfGeneratorReducer