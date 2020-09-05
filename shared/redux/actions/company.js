import { SET_COMPANY, SET_UPDATE_COMPANY } from '../types'
import agent from '../../utils/agent'
 

const getAndDispatchCompanyData = (dispatch, source) => {
    return agent.http.COMPANY.getCompanyData(source).then(response => {
        if (response && response.status === 200) {
            const payload = {
                id: response.data.data.id, 
                endpoint: response.data.data.endpoint,
                name: response.data.data.name,
                is_active: response.data.data.is_active, 
                is_supercompany: response.data.data.billing_company.is_supercompany, 
                is_paying_company: response.data.data.billing_company.is_paying_company,
                logo_url: response.data.data.logo_url,
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
                agent.websocket.COMPANY.recieveCompanyUpdated({
                    companyId: response.data.data.id,
                    callback: (data) => {
                        getAndDispatchCompanyData(dispatch, source)                  
                    }
                })
            }
        })
    }
}

const onGetCompanyUpdateData = (source) => {
    return (dispatch) => {
        return agent.http.COMPANY.getCompanySettingsData(source).then(response => {
            if (response && response.status === 200) {
                dispatch({ type:SET_UPDATE_COMPANY, payload: response.data.data })
            }
        })
    }
}

const onChangeCompanyUpdateDataState = (data) => {
    return (dispatch) => {
        dispatch({ type:SET_UPDATE_COMPANY, payload: data })
    }
}

const onUpdateCompanyUpdateData = (body, logoFile=null) => {
    return (_) => {
        let fileToUpload = []
        if (logoFile) {
            fileToUpload.push(logoFile)
        }
        return agent.http.COMPANY.updateCompanySettingsData(body, fileToUpload)
    } 
}

export default {
    onGetCompanyData,
    onGetCompanyUpdateData,
    onUpdateCompanyUpdateData,
    onChangeCompanyUpdateDataState
}