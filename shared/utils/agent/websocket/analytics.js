import Socket from '../socket'

const ANALYTICS = {
    recieveIsToOpenSurvey: async ({data, callback, userId}) => {
        if (data && ['is_to_open_survey'].includes(data.type) && userId === data.data.user_id) {
            return callback(data)
        } else if (data === undefined) {
            const websocket = await Socket.getInstance()
            websocket.addCallback(ANALYTICS.recieveIsToOpenSurvey, 'ANALYTICS.recieveIsToOpenSurvey', {callback, userId})
        }
    }
}

export default ANALYTICS