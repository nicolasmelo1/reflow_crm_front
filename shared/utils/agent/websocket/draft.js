import Socket from '../socket'

const DRAFT = {
    recieveFileRemoved: async ({data, blockId, callback}) => {
        if (data && ['send_removed_draft', 'send_public_removed_draft'].includes(data.type)) {
            return callback(data)
        } else if (data === undefined) {
            const websocket = await Socket.getInstance()
            websocket.addCallback(DRAFT.recieveFileRemoved, `DRAFT.recieveFileRemoved${blockId ? blockId : ''}`, {callback})
        }
    }
}

export default DRAFT