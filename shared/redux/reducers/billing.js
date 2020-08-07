import { SET_BILLING_COMPANY_DATA, SET_BILLING_PAYMENT_DATA, SET_BILLING_CHARGES_DATA } from '../types'


const initialState = {
    chargesData: [],
    paymentData: {
        gateway_token: '',
        company_invoice_emails: [{email: ''}],
        payment_method_type_id: null,
        invoice_date_type_id: null,
        credit_card_data: {
            card_number_last_four: '',
            card_expiration: '',
            credit_card_code: '',
            payment_company_name: ''
        },
    },
    companyData: {
        cnpj: '',
        zip_code: '',
        street: '',
        state: '',
        number: '',
        neighborhood: '',
        country: '',
        city: ''
    }
}

const billingReducer = (state = initialState, action) => {
    switch (action?.type) {
        case SET_BILLING_COMPANY_DATA:
            return {
                ...state,
                companyData: action.payload
            }
        case SET_BILLING_PAYMENT_DATA:
            return {
                ...state,
                paymentData: {
                    ...state.paymentData, 
                    ...action.payload
                }
            }
        case SET_BILLING_CHARGES_DATA:
            return {
                ...state,
                chargesData: action.payload
            }
        default:
            return state
    }
}

export default billingReducer