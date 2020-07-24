import { SET_BILLING_COMPANY_DATA, SET_BILLING_DATA } from '../types'


const initialState = {
    paymentData: {
        gateway_token: '',
        company_invoice_emails: [{email: ''}],
        payment_method_type_id: null,
        invoice_date_type_id: null,
        payment_data: {
            card_number_last_four: '',
            card_expiration: '',
            credit_card_code: ''
        },
        current_company_charges: []
    },
    companyData: {
        cnpj: '',
        address: '',
        zip_code: '',
        street: '',
        state: '',
        number: '',
        neighborhood: '',
        country: '',
        city: ''
    }
}

export default (state = initialState, action) => {
    switch (action?.type) {
        case SET_BILLING_COMPANY_DATA:
            return {
                ...state,
                companyData: action.payload
            }
        case SET_BILLING_DATA:
            return {
                ...state,
                paymentData: action.payload
            }
        default:
            return state
    }
}