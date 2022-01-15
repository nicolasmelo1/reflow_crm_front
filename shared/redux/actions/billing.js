import { SET_BILLING_COMPANY_DATA, SET_BILLING_PAYMENT_DATA, SET_BILLING_CHARGES_DATA } from '../types'
import agent from '../../utils/agent'

const onGetAddressOptions = (source) => {
    return (_) => {
        return agent.http.BILLING.getAddressOptions(source)
    }
}

const onGetPaymentData = (source) => {
    return (dispatch, getState) => {
        const types = getState().login.types.billing
        return agent.http.BILLING.getPaymentData(source).then(response => {
            if (response && response.status === 200) {
                const paymentPayload = {
                    company_invoice_emails: response.data.data.company.company_invoice_emails.length > 0 ? response.data.data.company.company_invoice_emails : [{ email: ''}],
                    payment_method_type_id: (response.data.data.payment_method_type_id) ? response.data.data.payment_method_type_id: types.payment_method_type[0].id,
                    invoice_date_type_id: (response.data.data.invoice_date_type_id) ? response.data.data.invoice_date_type_id: types.invoice_date_type[0].id,
                    credit_card_data: response.data.data.credit_card_data
                }
    
                const companyPayload = {
                    cnpj: response.data.data.cnpj,
                    zip_code: response.data.data.zip_code,
                    street: response.data.data.street,
                    state: response.data.data.state,
                    number: response.data.data.number,
                    neighborhood: response.data.data.neighborhood,
                    country: response.data.data.country,
                    city: response.data.data.city
                }
                
                const chargesPayload = {
                    planId: response.data.data.plan_id,
                    data: response.data.data.company.current_company_charges
                }

                console.log(chargesPayload)
                
                dispatch({ type: SET_BILLING_PAYMENT_DATA, payload: paymentPayload })
                dispatch({ type: SET_BILLING_COMPANY_DATA, payload: companyPayload })
                dispatch({ type: SET_BILLING_CHARGES_DATA, payload: chargesPayload })
            }
        })
    }
}

const onChangePaymentData = (data) => {
    return (dispatch) => {
        dispatch({ type: SET_BILLING_PAYMENT_DATA, payload: data })
    }
}

const onGetTotals = (body) => {
    return (_) => {
        return agent.http.BILLING.getTotals(body)
    }
}

const onUpdatePaymentData = (gatewayToken=null) => {
    return (_, getState) => {
        const { company_invoice_emails,...paymentData } = getState().billing.paymentData
        const state = getState()
        const body = {
            ...paymentData,
            ...state.billing.companyData,
            gateway_token: gatewayToken,
            plan_id: state.billing.chargesData.planId,
            company: {
                company_invoice_emails: company_invoice_emails,
                current_company_charges: state.billing.chargesData.data
            }
        }
        return agent.http.BILLING.updatePaymentData(body)
    }
}

const onRemoveCreditCardData = () => {
    return (dispatch, getState) => {
        let paymentState = getState().billing.paymentData

        agent.http.BILLING.removeCreditCard().then(response=> {
            if (response && response.status===200){
                paymentState.credit_card_data = {
                    card_number_last_four: '',
                    card_expiration: '',
                    credit_card_code: '',
                    payment_company_name: ''
                }
                dispatch({ type: SET_BILLING_PAYMENT_DATA, payload: {...paymentState}})
            }
        })
    }
}

const onChangeCompanyData = (data) => {
    return (dispatch) => {
        dispatch({ type: SET_BILLING_COMPANY_DATA, payload: data })
    }
}


const onChangeChargeData = (data) => {
    return (dispatch) => {
        dispatch({ type: SET_BILLING_CHARGES_DATA, payload: data })
    }
}


export default {
    onChangeChargeData,
    onChangeCompanyData,
    onGetPaymentData,
    onRemoveCreditCardData,
    onUpdatePaymentData,
    onChangePaymentData,
    onGetAddressOptions,
    onGetTotals
}
