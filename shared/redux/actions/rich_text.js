import { SET_RICH_TEXT_BLOCK_CAN_CONTAIN_BLOCKS } from '../types'
import agent from '../../utils/agent'

const onGetBlockCanContainBlock = (source) => {
    return async (dispatch) => {
        const response = await agent.http.RICH_TEXT.getBlockCanContainBlock(source)
        if (response && response.status === 200) {
            let payload = {}
            response.data.data.forEach(blockCanContain => { 
                payload[blockCanContain.block_id] = (payload[blockCanContain.block_id] || []).concat(blockCanContain.contain_id)
            })
            dispatch({ type: SET_RICH_TEXT_BLOCK_CAN_CONTAIN_BLOCKS, payload: payload})
        }
    }
}

export default {
    onGetBlockCanContainBlock
}