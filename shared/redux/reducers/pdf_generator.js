import { 
    SET_PDF_GENERATOR_CREATOR_TEMPLATES, 
    SET_PDF_GENERATOR_READER_TEMPLATES,
    SET_PDF_GENERATOR_ALLOWED_BLOCKS
} from '../types';

const initialState = {
    allowedBlocks: [],
    creator: {
        templates: []
    },
    reader: {
        templates: []
    }
}

const pdfGeneratorReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PDF_GENERATOR_ALLOWED_BLOCKS:
            return {
                ...state,
                allowedBlocks: action.payload
            } 
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