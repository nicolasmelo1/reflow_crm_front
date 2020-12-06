import { SET_PDF_GENERATOR_CREATOR_TEMPLATES, SET_PDF_GENERATOR_READER_TEMPLATES } from '../types';

const initialState = {
    creator: {
        templates: []
    },
    reader: {
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
        case SET_PDF_GENERATOR_READER_TEMPLATES:
            return {
                ...state,
                reader: {
                    ...state.reader,
                    templates: action.payload
                }
            }
        default:
            return state
    }
}

export default pdfGeneratorReducer