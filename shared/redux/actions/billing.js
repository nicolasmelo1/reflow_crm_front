import { SET_BILLING_COMPANY_DATA, SET_BILLING_DATA } from '../types'
import agent from '../../utils/agent'

const onGetAddressOptions = (source) => {
    return (_) => {
        return agent.http.BILLING.getAddressOptions(source)
    }
}

const onGetPaymentData = (source) => {
    return (dispatch) => {
        return agent.http.BILLING.getPaymentData(source).then(response => {
            if (response && response.status === 200) {
                dispatch({ type: SET_BILLING_DATA, payload: response.data.data })
            }
        })
    }
}

const onChangePaymentData = (data) => {
    return (dispatch) => {
        dispatch({ type: SET_BILLING_DATA, payload: data })
    }
}

const onGetCompanyData = (source) => {
    return (dispatch) => {
        return agent.http.BILLING.getCompanyData(source).then(response => {
            if (response && response.status === 200) {
                dispatch({ type: SET_BILLING_COMPANY_DATA, payload: response.data.data })
            }
        })
    }
}

const onChangeCompanyData = (data) => {
    return (dispatch) => {
        dispatch({ type: SET_BILLING_COMPANY_DATA, payload: data })
    }
}

export default {
    onGetCompanyData,
    onChangeCompanyData,
    onGetPaymentData,
    onChangePaymentData,
    onGetAddressOptions
}