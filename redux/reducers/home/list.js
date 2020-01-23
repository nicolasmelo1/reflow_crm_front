import { GET_DATA } from 'redux/types'

let initialState = {
    data: [],
    header: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA:
            return {
                ...state,
                data: action.payload.data

            }
        case GET_TABLE_HEADERS:
            return {
                ...state,
                header: action.payload.data
            }
        default:
            return state;
    }
};
