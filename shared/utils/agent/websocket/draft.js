import Socket from '../socket'

const DRAFT = {
    recieveFileRemoved: async ({data, blockId, callback}) => {
        if (data && data.type === 'send_removed_draft') {
            return callback(data)
        } else if (data === undefined) {
            const websocket = await Socket.getInstance()
            websocket.addCallback(DRAFT.recieveFileRemoved, `DRAFT.recieveFileRemoved${blockId}`, {callback})
        }
    }
}

export default DRAFT