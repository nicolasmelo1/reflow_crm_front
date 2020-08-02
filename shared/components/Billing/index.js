import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import creditCardType from 'credit-card-type'
import { VINDI_PUBLIC_API, VINDI_PUBLIC_API_KEY } from '../../config'
import { strings } from '../../utils/constants'
import actions from '../../redux/actions'
import PaymentForm from './PaymentForm'
import ChargeForm from './ChargeForm'
import CompanyForm from './CompanyForm'
import {
    BillingContainer,
    BillingExpandableCardButtons,
    BillingExpandableCardText,
    BillingExpandableCardArrowDown,
    BillingSaveButton,
    BillingExpandableCardIcon,
    BillingExpandableCardError
} from '../../styles/Billing'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class Billing extends React.Component {
    constructor(props) {
        super(props)
        this.cancelToken = axios.CancelToken
        this.source = null
        this.state = {
            addressOptions: [],
            isCompanyFormOpen: false,
            isChargeFormOpen: false, 
            isPaymentFormOpen: false,
            companyDataFormErrors: {},
            chargeDataFormErrors: {},
            paymentDataFormErrors: {},
            creditCardDataErrors: [],
            creditCardData: {
                card_number: '',
                cvv: '',
                card_expiration: '',
                holder_name: '',
                payment_method_code: 'credit_card',
                payment_company_code: ''
            }
        }
    }

    setIsChargeFormOpen = () => this.setState(state => ({ ...state, isChargeFormOpen: !state.isChargeFormOpen }))

    setIsPaymentFormOpen = () => this.setState(state => ({...state, isPaymentFormOpen: !state.isPaymentFormOpen }))

    setIsCompanyFormOpen = () => this.setState(state => ({...state, isCompanyFormOpen: !state.isCompanyFormOpen }))

    setAddressOptions = (data) => this.setState(state => ({...state, addressOptions: data }))
    
    setCompanyDataFormErrors = (data) => this.setState(state => ({...state, companyDataFormErrors: data }))

    setChargeDataFormErrors = (data) => this.setState(state => ({...state, chargeDataFormErrors: data }))

    setPaymentDataFormErrors = (data) => this.setState(state => ({...state, paymentDataFormErrors: data }))

    setCreditCardDataErrors = (data) => this.setState(state => ({...state, creditCardDataErrors: data}))
    
    setCreditCardData = (data) => this.setState(state => ({...state, creditCardData: data}))

    isToShowCreditCardForm = () => {
        const paymentMethodType = this.props.login.types.billing.payment_method_type.filter(paymentMethodType => paymentMethodType.id === this.props.billing.paymentData.payment_method_type_id)
        if (paymentMethodType.length > 0 && paymentMethodType[0].name === 'credit_card') {
            if (this.props.billing.paymentData.credit_card_data){
                return [...Object.entries(this.props.billing.paymentData.credit_card_data)].some(value => ['', null].includes(value[1]))
            } else {
                return true
            }
        } else {
            return false
        }
    }

    setError = (field, type) => ({[field]: type})
    
    onSetError = (error) => {
        if (error.reason) {
            if (error.reason.includes('invalid_registry_code')) {
                this.setCompanyDataFormErrors({ ...this.state.companyDataFormErrors, ...this.setError('cnpj', ['invalid'])})
            } 
            if (error.reason.includes('cannot_be_bigger_than_three')) {
                this.setPaymentDataFormErrors({ ...this.state.paymentDataFormErrors, ...this.setError('company_invoice_emails', ['invalid'])})
            }
        }
        if ([...Object.entries(error)].some(value => [...Object.entries(this.props.billing.paymentData)].map(value=> value[0]).includes(value[0]))) {
            let paymentDataFormErrors = {}
            Object.entries(error).forEach(([key, value]) => {
                paymentDataFormErrors = {...paymentDataFormErrors, ...this.setError(key, value)}
            })
            this.setPaymentDataFormErrors({ ...this.state.paymentDataFormErrors, ...paymentDataFormErrors})

        } else if ([...Object.entries(error)].some(value => [...Object.entries(this.props.billing.companyData).map(value=> value[0])].includes(value[0]))) {
            let companyDataFormErrors = {}
            Object.entries(error).forEach(([key, value]) => {
                companyDataFormErrors = {...companyDataFormErrors, ...this.setError(key, value)}
            })
            this.setCompanyDataFormErrors({ ...this.state.companyDataFormErrors, ...companyDataFormErrors})
        }
    }

    onSubmitPayment = (gatewayToken = null) => {
        this.props.onUpdatePaymentData(gatewayToken).then(response=>{
            if (response && response.status !== 200 && response.data.error) {
                this.onSetError(response.data.error)
            }
        })
    }

    onSubmit = () => {
        if (this.isToShowCreditCardForm()) {
            axios.post(VINDI_PUBLIC_API, {
                ...this.state.creditCardData, 
                payment_company_code: creditCardType(this.state.creditCardData.card_number)[0].type
            }, {
                auth: {
                    username: VINDI_PUBLIC_API_KEY,
                    password: ''
                }
            }).then(response => {
                if (response && response.status === 200) {
                    this.onSubmitPayment(response.data.payment_profile.gateway_token)
                }
            }).catch(error => {
                if (error && error.response && !this.state.creditCardDataErrors.includes(error.response.data.errors[0].parameter)) {
                    this.state.creditCardDataErrors.push(error.response.data.errors[0].parameter)
                    this.setCreditCardDataErrors([...this.state.creditCardDataErrors])
                }
            })
        } else {
            this.onSubmitPayment()
        }
    }
    
    componentDidMount = () => {
        this.source = this.cancelToken.source()
        this.props.onGetPaymentData(this.source)
        this.props.onGetAddressOptions(this.source).then(response => {
            if (response && response.status === 200) {
                this.setAddressOptions(response.data.data)
            }
        })
    }
    
    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        return (
            <View/>
        )
    }

    renderWeb = () => {
        return (
            <BillingContainer>
                <BillingExpandableCardButtons errors={Array.from(Object.keys(this.state.companyDataFormErrors)).length > 0} onClick={e=> {this.setIsCompanyFormOpen()}}>
                    <BillingExpandableCardText>
                        {strings['pt-br']['billingExpandableCardCompanyConfigurationLabel']}&nbsp;
                        {Object.keys(this.state.companyDataFormErrors).length > 0 ? (
                            <BillingExpandableCardError>
                                <BillingExpandableCardIcon style={{color: 'red'}} icon={'times-circle'}/>
                                &nbsp;
                                <small style={{color: 'red', fontSize: '10px' }}>
                                    {strings['pt-br']['billingExpandableCardErrorMessage']}{this.state.isPaymentFormOpen ? '' : strings['pt-br']['billingExpandableCardErrorMessageIfFormClosed']}
                                </small>
                            </BillingExpandableCardError>
                        ) : (
                            <BillingExpandableCardIcon icon={this.state.isCompanyFormOpen ? 'chevron-up' : 'chevron-down'}/>
                        )}
                    </BillingExpandableCardText>
                </BillingExpandableCardButtons>
                {this.state.isCompanyFormOpen ? (
                    <CompanyForm 
                    companyDataFormErrors={this.state.companyDataFormErrors}
                    setCompanyDataFormErrors={this.setCompanyDataFormErrors}
                    cancelToken={this.cancelToken}
                    companyData={this.props.billing.companyData}
                    addressOptions={this.state.addressOptions}
                    setIsCompanyFormOpen={this.setIsCompanyFormOpen}
                    onChangeCompanyData={this.props.onChangeCompanyData}
                    />
                ): ''}
                <BillingExpandableCardArrowDown/>
                <BillingExpandableCardButtons onClick={e => this.setIsChargeFormOpen()}>
                    <BillingExpandableCardText>
                        {strings['pt-br']['billingExpandableCardChargeConfigurationLabel']}&nbsp;<BillingExpandableCardIcon icon={this.state.isChargeFormOpen ? 'chevron-up' : 'chevron-down'}/>
                    </BillingExpandableCardText>
                </BillingExpandableCardButtons>
                {this.state.isChargeFormOpen ? (
                    <ChargeForm
                    chargeDataFormErrors={this.state.chargeDataFormErrors}
                    setChargeDataFormErrors={this.setChargeDataFormErrors}
                    onChangeChargeData={this.props.onChangeChargeData}
                    onGetTotals={this.props.onGetTotals}
                    chargesData={this.props.billing.chargesData}
                    types={this.props.login.types.billing}
                    />
                ) : ''}
                <BillingExpandableCardArrowDown/>
                <BillingExpandableCardButtons 
                errors={Array.from(Object.keys(this.state.paymentDataFormErrors)).length > 0 || this.state.creditCardDataErrors.length > 0} 
                onClick={e=> this.setIsPaymentFormOpen()}
                >
                    <BillingExpandableCardText>
                        {strings['pt-br']['billingExpandableCardPaymentConfigurationLabel']}&nbsp;
                        {Object.keys(this.state.paymentDataFormErrors).length > 0 ? (
                            <BillingExpandableCardError>
                                <BillingExpandableCardIcon style={{color: 'red'}} icon={'times-circle'}/>
                                &nbsp;
                                <small style={{color: 'red', fontSize: '10px' }}>
                                    {strings['pt-br']['billingExpandableCardErrorMessage']}{this.state.isPaymentFormOpen ? '' : strings['pt-br']['billingExpandableCardErrorMessageIfFormClosed']}
                                </small>
                            </BillingExpandableCardError>
                        ) : (
                            <BillingExpandableCardIcon icon={this.state.isPaymentFormOpen ? 'chevron-up' : 'chevron-down'}/>
                        )}
                    </BillingExpandableCardText>
                </BillingExpandableCardButtons>
                {this.state.isPaymentFormOpen ? (
                    <PaymentForm
                    setPaymentDataFormErrors={this.setPaymentDataFormErrors}
                    paymentDataFormErrors={this.state.paymentDataFormErrors}
                    setCreditCardData={this.setCreditCardData}
                    creditCardData={this.state.creditCardData}
                    creditCardDataErrors={this.state.creditCardDataErrors}
                    setCreditCardDataErrors={this.setCreditCardDataErrors}
                    isToShowCreditCardForm={this.isToShowCreditCardForm}
                    onRemoveCreditCardData={this.props.onRemoveCreditCardData}
                    onChangePaymentData={this.props.onChangePaymentData}
                    paymentData={this.props.billing.paymentData}
                    types={this.props.login.types.billing}
                    />
                ): ''}
                
                <BillingSaveButton onClick={e => {this.onSubmit()}}>
                    {strings['pt-br']['billingSaveButtonLabel']}
                </BillingSaveButton>
            </BillingContainer>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ login: state.login, billing: state.billing }), actions)(Billing)