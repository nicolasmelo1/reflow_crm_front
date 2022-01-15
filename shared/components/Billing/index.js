import React from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import axios from 'axios'
import { VINDI_PUBLIC_API, VINDI_PUBLIC_API_KEY } from '../../config'
import dynamicImport from '../../utils/dynamicImport'
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
import agent from '../../utils/agent'

const connect = dynamicImport('reduxConnect', 'default')
const creditCardType = dynamicImport('credit-card-type', '')
const Spinner = dynamicImport('react-bootstrap', 'Spinner')

/**
 * This component is responsible for holding the billing formulary.
 * 
 * The billing formulary as you might see in this folder is composed with 3 main parts:
 * 
 * - The first - Specific data about the company like the cpf/cnpj and also the address.
 * - The second - The charge data. In Reflow the user is free, he is not bound to plans but instead
 * he can add what he wishes for his plan whenever he needs.
 * - The third - Payment data. This information is: when he wants to be charged (what date), on what e-mail we are going to send
 * invoice, and the credit card information if he is paying with a credit card.
 */
class Billing extends React.Component {
    constructor(props) {
        super(props)
        this.cancelToken = axios.CancelToken
        this.source = null
        this.state = {
            showAllGoodIcon: false,
            isSubmitting: false,
            addressOptions: [],
            plans: [],
            isCompanyFormOpen: false,
            isChargeFormOpen: true, 
            isPaymentFormOpen: true,
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
    setPlans = (plans) => this.setState(state => ({ ...state, plans: plans }))
    setShowAllGoodIcon = () => this.setState(state => ({...state, showAllGoodIcon: !state.showAllGoodIcon }))
    setIsSubmitting = () => this.setState(state => ({ ...state, isSubmitting: !state.isSubmitting }))

    setIsChargeFormOpen = () => this.setState(state => ({ ...state, isChargeFormOpen: !state.isChargeFormOpen }))
    setIsPaymentFormOpen = () => this.setState(state => ({...state, isPaymentFormOpen: !state.isPaymentFormOpen }))
    setIsCompanyFormOpen = () => this.setState(state => ({...state, isCompanyFormOpen: !state.isCompanyFormOpen }))

    setAddressOptions = (data) => this.setState(state => ({...state, addressOptions: data }))

    setCompanyDataFormErrors = (data) => this.setState(state => ({...state, companyDataFormErrors: data }))
    setChargeDataFormErrors = (data) => this.setState(state => ({...state, chargeDataFormErrors: data }))
    setPaymentDataFormErrors = (data) => this.setState(state => ({...state, paymentDataFormErrors: data }))
    setCreditCardDataErrors = (data) => this.setState(state => ({...state, creditCardDataErrors: data}))
    
    setCreditCardData = (data) => this.setState(state => ({...state, creditCardData: data}))
    
    /**
     * Retrieves an object where the key is the field name and the type is an array containing the errors for this particular field.
     * IMPORTANT: FIELD NAME HERE IS EACH KEY FROM THE JSON WE SEND TO THE SERVER AND RECIEVES FROM THE SERVER TO LOAD THE BILLING DATA.
     * 
     * @param {String} field - The name of the field that contains an error
     * @param {Array<String>} type - An array containing all of the errors that have happened for this field name 
     */
    addError = (field, type) => ({[field]: type})

    /**
     * This function is just a boolean function that returns true or false. If the user is NOT paying by credit card you don't
     * have to show the credit card form. The other condition is if he has a credit_card_data defined. `credit_card_data` holds
     * the data that we use to display the credit card saved for the user, if it is null or the keys are empty we assume no credit
     * card was saved so we need to display it for the user.
     */
    isToShowCreditCardForm = () => {
        const paymentMethodType = (this.props?.login?.types?.billing?.payment_method_type || []).filter(paymentMethodType => paymentMethodType.id === this.props.billing.paymentData.payment_method_type_id)
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
    
    /**
     * As the name suggests this is for retrieving something. This function is for retriving what to render inside of the Save button.
     * 
     * We actually have 3 states when we save: `not saving at all`, `processing the save`, `all good icon to show everything went fine`
     * When we are submitting we show a spinner to show that it is loading. After is saved, for a short period of time, shows a "check" 
     * icon to give it a nice UX touch. After that, shows a simple text inside the save button.
     */
    getWhatToRenderInsideSaveButton = () => {
        if (this.state.isSubmitting) {
            return (<Spinner animation="border" size="sm"/>)
        } else if (this.state.showAllGoodIcon) {
            return (<FontAwesomeIcon icon="check"/>)
        } else {
            return (<span>{strings['pt-br']['billingSaveButtonLabel']}</span>)
        }
    }

    /**
     * Sets the error on the formulary, this is not anything like the formulary in `Notification/NotificationConfigurationForm.js` or `Onboarding/index.js`
     * because this is a lot more complex than both formularies.
     * 
     * This is actually simple, there are some special errors that we validate first and set them by hand. Otherwise we send the errors to each specific 
     * formulary part. If there are any error in the paymentData fields we set the errors on `paymentDataFormErrors` state. Otherwise it is probably an error
     * in the companyData field so we set the errors in the state `companyDataFormErrors`. Separating the errors this way, we can show easily a red card and alert
     * to the user that a error have happened in each specific separate part of the formulary.
     * 
     * @param {Object} error - This is the data that was recieved from the backend response when an error happened (so when the request haven't returned status 200)
     */
    onSetError = (error) => {
        if (error.reason) {
            if (error.reason.includes('invalid_registry_code')) {
                this.setCompanyDataFormErrors({ ...this.state.companyDataFormErrors, ...this.addError('cnpj', ['invalid'])})
            } 
            if (error.reason.includes('cannot_be_bigger_than_three_or_less_than_one')) {
                this.setPaymentDataFormErrors({ ...this.state.paymentDataFormErrors, ...this.addError('company_invoice_emails', ['invalid'])})
            }
        }
        if ([...Object.entries(error)].some(value => [...Object.entries(this.props.billing.paymentData)].map(value=> value[0]).includes(value[0]))) {
            let paymentDataFormErrors = {}
            Object.entries(error).forEach(([key, value]) => {
                paymentDataFormErrors = {...paymentDataFormErrors, ...this.addError(key, value)}
            })
            this.setPaymentDataFormErrors({ ...this.state.paymentDataFormErrors, ...paymentDataFormErrors})

        } else if ([...Object.entries(error)].some(value => [...Object.entries(this.props.billing.companyData).map(value=> value[0])].includes(value[0]))) {
            let companyDataFormErrors = {}
            Object.entries(error).forEach(([key, value]) => {
                companyDataFormErrors = {...companyDataFormErrors, ...this.addError(key, value)}
            })
            this.setCompanyDataFormErrors({ ...this.state.companyDataFormErrors, ...companyDataFormErrors})
        }
    }

    /**
     * This is actually the "real" submit function. This effectively submits the formulary data to the backend.
     * It's important to understand that this actually merges the data from each part of the formulary.
     * 
     * If an error happens we send the error data to `onSetError` function so it can handle the errors, otherwise
     * we retrive the payment data again to refresh the data of the formulary. (this is actually usefull because of credit_card formulary,
     * when the user fills the credit_card info, if we don't refresh the billingData the formulary will stay filled, but what we actually want
     * is display some parts of the credit card so he can delete it. Check `isToShowCreditCardForm` function for details)
     * 
     * @param {String} gatewayToken - (optional) - The gateway token recieved by VINDI (our payment gateway) public API.
     * Check here for further reference: https://vindi.github.io/api-docs/dist/#/public/postV1PublicPaymentProfiles
     */
    onSubmitPayment = (gatewayToken = null) => {
        this.props.onUpdatePaymentData(gatewayToken).then(response=>{
            this.setIsSubmitting(false)
            if (response && response.status !== 200 && response.data.error) {
                this.onSetError(response.data.error)
            } else {
                this.props.onGetPaymentData(this.source)
                this.setShowAllGoodIcon(true)
                setTimeout(() => {
                    if (this._ismounted) {
                        this.setShowAllGoodIcon(false)
                    }
                }, 1000)
            }
        })
    }
    
    /**
     * This method is called when the user clicks `save` in the button. With this we actually check if the user has selected the credit_card
     * paymentType or not.
     * 
     * If the user has selected the credit card payment type we need to first send the credit card data to VINDI (so the credit card data are 
     * not runed inside our servers) and then get a gatewayToken, that we need to send to our server so we can save it.
     * 
     * Last but not least, any errors that happens while trying to save the credit card data is updated in the `creditCardDataErrors` state
     * array, so we can show it in the formulary.
     */
    onSubmit = () => {
        this.setIsSubmitting(true)
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
                if (response && [200, 201].includes(response.status)) {
                    this.onSubmitPayment(response.data.payment_profile.gateway_token)
                } else {
                    this.setIsSubmitting(false)
                }
            }).catch(error => {
                this.setIsSubmitting(false)
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
        // when we mount the component we get the addressOptions that the user can select in the CompanyForm and
        // the hole payment data. Nothing much actually.
        this._ismounted = true
        this.source = this.cancelToken.source()
        agent.http.BILLING.getPlans(this.source).then(response => {
            if (response && response.status === 200) {
                this.setPlans(response.data.data)
            }
        })
        this.props.onGetPaymentData(this.source)
        this.props.onGetAddressOptions(this.source).then(response => {
            if (response && response.status === 200) {
                this.setAddressOptions(response.data.data)
            }
        })
    }
    
    componentWillUnmount = () => {
        this._ismounted = false
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
                    plans={this.state.plans}
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
                <BillingSaveButton onClick={e => {(!this.state.isSubmitting) ? this.onSubmit() : null}}>
                    {this.getWhatToRenderInsideSaveButton()}
                </BillingSaveButton>
            </BillingContainer>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ login: state.login, billing: state.billing }), actions)(Billing)