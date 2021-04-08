import React from 'react'
import { connect } from 'react-redux';
import actions from '../../redux/actions'
import dynamicImport from '../../utils/dynamicImport'
import { numberUnmasker } from '../../utils/numberMasker'
import { strings, paths, errors } from '../../utils/constants'
import FirstStepForm from './FirstStepForm'
import SecondStepForm from './SecondStepForm'
import Styled from './styles'

const Router = dynamicImport('next/router')

/**
 * This component handles the onboarding of a new user. It is important to understand that right now the onboarding formulary consists of 2 simple steps: 
 * First Step Formulary - All of the basic information we need for the user to start using reflow (name of the user, name of the company, phone number and etc.)
 * Second Step Formulary - Set password
 * 
 * Most of the logic of both steps is handled here since we upload the data from here after we finish both steps, also the data of one steps affects the other step.
 * If we made something bad in the first step and tries to save, we will handle it here.
 * 
 * @param {String} partner - The partner name, usually recieved from the url as a parameter with the ?partner= tag. This is something we can define as we want.
 * @param {String} shared_by - The company endpoint, used for referral, usually recieved from the url as a query parameter with the ?shared_by= tag. The shared_by
 * is something that usually we set for the user. The user can't set this parameter
 * @param {String} discount_coupon - The discount coupon the user is using when entering the platform.
 * @param {Function} openLinks - (MOBILE ONLY) - This is used to open the terms of usage and privacy policy links. With this we can open the browser directly inside
 * of the app.
 */
class Onboarding extends React.Component {
    constructor(props) {
        super(props)
        
        this.formularySteps = ['set-email', 'set-password']
        this.errorMessages = {
            name: strings['pt-br']['onboardingNameAndLastNameError'],
            phone: strings['pt-br']['onboardingPhoneError'],
            email: strings['pt-br']['onboardingEmailError'],
            confirmEmail: strings['pt-br']['onboardingConfirmEmailError'],
            confirmPassword: strings['pt-br']['onboardingConfirmPasswordError']
        }
        
        this.state = {
            slideLogo: false,
            showLogo: false,
            showForm: false,
            step: 0,
            errors: {},
            name: '',
            phone: '',
            email: '',
            confirmEmail: '',
            companyName: '',
            declarationChecked: false,
            password: '',
            confirmPassword: '',
        }
    }
    // ------------------------------------------------------------------------------------------
    setSlideLogo = (data) => this.setState(state => state.slideLogo = data)
    // ------------------------------------------------------------------------------------------
    setShowLogo = (data) => this.setState(state => state.showLogo = data)
    // ------------------------------------------------------------------------------------------
    setShowForm = (data) => this.setState(state => state.showForm = data)
    // ------------------------------------------------------------------------------------------
    setStep = (data) => this.setState(state => state.step = data)
    // ------------------------------------------------------------------------------------------
    setErrors = (data) => this.setState(state => ({...state, errors: data}))
    // ------------------------------------------------------------------------------------------
    setName = (data) => this.setState(state => ({...state, name: data}))
    // ------------------------------------------------------------------------------------------
    setPhone = (data) => this.setState(state => ({...state, phone: numberUnmasker(data, this.getPhoneNumberMask(data)).length <= 11 ? numberUnmasker(data, this.getPhoneNumberMask(data)) : this.state.phone}))
    // ------------------------------------------------------------------------------------------
    setEmail = (data) => this.setState(state => ({...state, email: data}))
    // ------------------------------------------------------------------------------------------
    setConfirmEmail = (data) => this.setState(state => ({...state, confirmEmail: data}))
    // ------------------------------------------------------------------------------------------
    setCompanyName = (data) => this.setState(state => ({...state, companyName: data}))
    // ------------------------------------------------------------------------------------------
    setDeclarationChecked = (data) => this.setState(state => ({...state, declarationChecked: data}))
    // ------------------------------------------------------------------------------------------
    setPassword = (data) => this.setState(state => ({...state, password: data}))
    // ------------------------------------------------------------------------------------------
    setConfirmPassword = (data) => this.setState(state => ({...state, confirmPassword: data}))
    // ------------------------------------------------------------------------------------------
    /**
     * In Brazil the phone number can have 8 digits (besides the DDD (a 2 digit number of the region)) or 9 digits. With this
     * we can mask it dynamically.
     * 
     * @param {String} text - The phone number as string.
     */
    getPhoneNumberMask = (text) => {
        if (!text || text.length <= 10) {
            return '(00) 0000-0000'
        } else {
            return '(00) 00000-0000'
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This function is used for validating if the data the user inserted in a field name is valid or not. You will notice that this is a switch
     * with a set of statements. Each return case is a different condition to check if the data is valid.
     * 
     * @param {String} name - The name is actually a key that we use to reference on what the field you are validating is.
     * If you insert more fields in the formulary, then we will probably have more keys. exept from 'name', all of the keys are
     * based on the keys from the `userData` object.
     * @param {String} value - The value the user inserted in this field to validate.
     */
    isValid = (name, value) => {
        switch (name) {
            case 'name':
                return ![null, undefined, ''].includes(value) && value.split(' ').length > 1 && value.split(' ')[1] !== ''
            case 'phone':
                return ![null, undefined, ''].includes(value) && numberUnmasker(value, this.getPhoneNumberMask(value)).length >= 10
            case 'email':
                return ![null, undefined, ''].includes(value) && /@[A-z\-]+\./g.test(value)
            case 'confirmEmail':
                return ![null, undefined, ''].includes(value) && /@[A-z\-]+\./g.test(value) && this.state.email === value
            case 'confirmPassword':
                return ![null, undefined, ''].includes(value) && this.state.password === value
            default:
                return true
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This does two things:
     * - Checks if a field is valid and 
     * - Sets an error key with its message if the value of the field is invalid.
     * @param {String} field - The field is actually a key that we use to reference on what the field you are validating is.
     * If you insert more fields in the formulary, then we will probably have more keys. exept from 'name', all of the keys are
     * based on the keys from the `userData` object.
     * @param {String} value - The value the user inserted in this field to validate.
     */
    onValidate = (field, value) => {
        if (!this.isValid(field, value)) {
            this.state.errors[field] = this.errorMessages[field]
        } else {
            delete this.state.errors[field]
        }
        this.setErrors({...this.state.errors})
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Submits the data of all of the steps to the backend. This is actually why we need most logic inside of this component.
     * 
     * This function effectively constructs and builds the data before sending. When everything wents fine it redirects the user back to the login page
     * otherwise it shows an error to the user.
     */
    onSubmitForm = async () => {
        const data = {
            partner: this.props.partner ? this.props.partner : null,
            shared_by: this.props.sharedBy ? this.props.sharedBy : null,
            discount_coupon: this.props.discount_coupon ? this.props.discount_coupon : null,
            company_name: this.state.companyName,
            user_phone: this.state.phone,
            user_first_name: this.state.name.split(' ')[0],
            user_last_name: this.state.name.split(' ').slice(1).join(' '),
            user_email: this.state.email,
            user_password: this.state.password
        }

        this.props.onCreateUserAndCompany(data).then(response => {
            if (response && response.status !== 200){
                this.props.onAddNotification(errors('pt-br', response.data.reason).replace('{}', this.state.email), 'error')
            } else if (!response) {
                this.props.onAddNotification(strings['pt-br']['onboardingUnknownError'], 'error')
            } else {
                this.redirectToLogin()
            }
        })
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Function used for redirection the user back to the login page.
     * 
     * It's nice to see that if the page is inside an iframe it redirects the user outside of the the iframe
     * this way we can actually embed this formulary on landing pages and other stuff.
     * 
     * On mobile it just redirects the user back to the login using urls instead of direct navigation.
     */
    redirectToLogin = () => {
        if (process.env['APP'] === 'web') {
            if (window.location !== window.parent.location) { 
                // The page is in an iFrames 
                window.parent.location.replace(window.location.origin + paths.login().asUrl);
            } else { 
                // The page is not in an iFrame 
                Router.push(paths.login().asUrl, paths.login().asUrl, { shallow: true })
            } 
        } else {
            const Linking = require('expo-linking')
            Linking.openURL(Linking.makeUrl(paths.login().asUrl))
        }
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    // most of the logic here is just for showing a simple but nice animation when the user first opens the formulary.
    componentDidMount = () => {
        this._ismounted = true
        if (process.env['APP'] === 'web') {
            setTimeout(() => {
                if (this._ismounted) this.setShowLogo(true)
            }, 100)
            setTimeout(() => {
                if (this._ismounted) this.setSlideLogo(true)
            }, 1000)
            setTimeout(() => {
                if (this._ismounted) this.setShowForm(true)
            }, 1500)
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    componentWillUnmount = () => {
        this._ismounted = false
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //########################################################################################//
    renderMobile = () => {
        return (
            <Styled.OnboardingContainer>
                {this.formularySteps[this.state.step] === 'set-email' ? (
                    <FirstStepForm
                    openLinks={this.props.openLinks}
                    showForm={this.state.showForm}
                    onValidate={this.onValidate}
                    errors={this.state.errors}
                    name={this.state.name}
                    setName={this.setName}
                    phone={this.state.phone}
                    setPhone={this.setPhone}
                    getPhoneNumberMask={this.getPhoneNumberMask}
                    email={this.state.email}
                    setEmail={this.setEmail}
                    confirmEmail={this.state.confirmEmail}
                    setConfirmEmail={this.setConfirmEmail}
                    companyName={this.state.companyName}
                    setCompanyName={this.setCompanyName}
                    declarationChecked={this.state.declarationChecked}
                    setDeclarationChecked={this.setDeclarationChecked}
                    redirectToLogin={this.redirectToLogin}
                    setStep={this.setStep}
                    />
                ) : (
                    <SecondStepForm
                    showForm={this.state.showForm}
                    onValidate={this.onValidate}
                    setStep={this.setStep}
                    errors={this.state.errors}
                    password={this.state.password}
                    setPassword={this.setPassword}
                    confirmPassword={this.state.confirmPassword}
                    setConfirmPassword={this.setConfirmPassword}
                    onSubmitForm={this.onSubmitForm}
                    />
                )}
            </Styled.OnboardingContainer>
        )
    }
    //########################################################################################//
    renderWeb = () => {
        return (
            <Styled.OnboardingContainer step={this.state.step}>
                <Styled.OnboardingLogo src="/complete_logo.png" showLogo={this.state.showLogo} slideLogo={this.state.slideLogo} step={this.state.step}/>
                {this.formularySteps[this.state.step] === 'set-email' ? (
                    <FirstStepForm
                    showForm={this.state.showForm}
                    onValidate={this.onValidate}
                    errors={this.state.errors}
                    name={this.state.name}
                    setName={this.setName}
                    phone={this.state.phone}
                    setPhone={this.setPhone}
                    getPhoneNumberMask={this.getPhoneNumberMask}
                    email={this.state.email}
                    setEmail={this.setEmail}
                    confirmEmail={this.state.confirmEmail}
                    setConfirmEmail={this.setConfirmEmail}
                    companyName={this.state.companyName}
                    setCompanyName={this.setCompanyName}
                    declarationChecked={this.state.declarationChecked}
                    setDeclarationChecked={this.setDeclarationChecked}
                    redirectToLogin={this.redirectToLogin}
                    setStep={this.setStep}
                    />
                ) : (
                    <SecondStepForm
                    showForm={this.state.showForm}
                    onValidate={this.onValidate}
                    setStep={this.setStep}
                    errors={this.state.errors}
                    password={this.state.password}
                    setPassword={this.setPassword}
                    confirmPassword={this.state.confirmPassword}
                    setConfirmPassword={this.setConfirmPassword}
                    onSubmitForm={this.onSubmitForm}
                    />
                )}
            </Styled.OnboardingContainer>
        )
    }
    //########################################################################################//
    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ }), actions)(Onboarding);