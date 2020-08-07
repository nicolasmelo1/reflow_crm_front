import { SET_DASHBOARD_CHARTS, SET_DASHBOARD_UPDATE_DATES } from '../../types'
import { jsDateToStringFormat } from '../../../utils/dates'
import login from '../login'
import moment from 'moment'


const start = moment().subtract(59, 'days').toDate()
const end = moment().toDate()

let initialState = {
    charts: [],
    updateDates: {
        startDate: jsDateToStringFormat(start, login().dateFormat.split(' ')[0]),
        endDate: jsDateToStringFormat(end, login().dateFormat.split(' ')[0])
    }
}

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DASHBOARD_CHARTS:
            return {
                ...state,
                charts: action.payload
            }
        case SET_DASHBOARD_UPDATE_DATES:
            return {
                ...state,
                updateDates: action.payload
            }
        default:
            return state
    }
}

export default dashboardReducer