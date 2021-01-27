import { 
    SET_RICH_TEXT_BLOCK_CAN_CONTAIN_BLOCKS
} from '../types';

const initialState = {
    blockCanContainBlock: {},
}

const richTextReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_RICH_TEXT_BLOCK_CAN_CONTAIN_BLOCKS:
            return {
                blockCanContainBlock: action.payload
            }
        default:
            return state
    }
}

export default richTextReducer