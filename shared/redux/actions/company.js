import { SET_COMPANY } from '../types'
import agent from '../../utils/agent'
 

const getAndDispatchCompanyData = (dispatch, source) => {
    return agent.http.COMPANY.getCompanyData(source).then(response => {
        if (response && response.status === 200) {
            const payload = {
                id: response.data.data.id, 
                endpoint: response.data.data.endpoint,
                name: response.data.data.name,
                is_active: response.data.data.is_active, 
                is_supercompany: response.data.data.is_supercompany, 
                is_paying_company: response.data.data.is_paying_company,
                free_trial_days: response.data.data.free_trial_days,
                created_at: response.data.data.created_at
            }
            dispatch({ type: SET_COMPANY, payload: payload })
        }
        return response
    })
}

const onGetCompanyData = (source) => {
    return (dispatch) => {
        return getAndDispatchCompanyData(dispatch, source).then(response=> {
            if (response && response.status === 200) {
                agent.websocket.COMPANY.recieveBillingUpdated({
                    companyId: response.data.data.id,
                    callback: (data) => {
                        getAndDispatchCompanyData(dispatch, source)                  
                    }
                })
            }
        })
    }
}

export default {
    onGetCompanyData
}