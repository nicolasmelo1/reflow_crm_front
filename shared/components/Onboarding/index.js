import React from 'react'
import Router from 'next/router'
import { connect } from 'react-redux';
import { Linking } from 'expo'
import actions from '../../redux/actions'
import { numberUnmasker } from '../../utils/numberMasker'
import { strings, paths, errors } from '../../utils/constants'
import FirstStepForm from './FirstStepForm'
import SecondStepForm from './SecondStepForm'

import { 
    OnboardingLogo,
    OnboardingContainer
} from '../../styles/Onboarding'
import { View } from 'react-native'

/**
 * This component handles the onboarding of a new user. It is important to understand that right now the onboarding formulary consists of 2 simple steps: 
 * 1-All of the basic information we need for the user to start using reflow
 * 2-Set password
 * 
 * @param {String} partner - The partner name, usually recieved from the url as a parameter with the ?partner= tag
 * @param {String} shared_by - The company endpoint, used for referral, usually recieved from the url as a query parameter with the ?shared_by= tag
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
    
    setSlideLogo = (data) => this.setState(state => state.slideLogo = data)
    setShowLogo = (data) => this.setState(state => state.showLogo = data)
    setShowForm = (data) => this.setState(state => state.showForm = data)
    setStep = (data) => this.setState(state => state.step = data)

    setErrors = (data) => this.setState(state => ({...state, errors: data}))

    setName = (data) => this.setState(state => ({...state, name: data}))
    setPhone = (data) => this.setState(state => ({...state, phone: numberUnmasker(data, this.getPhoneNumberMask(data)).length <= 11 ? numberUnmasker(data, this.getPhoneNumberMask(data)) : this.state.phone}))
    setEmail = (data) => this.setState(state => ({...state, email: data}))
    setConfirmEmail = (data) => this.setState(state => ({...state, confirmEmail: data}))
    setCompanyName = (data) => this.setState(state => ({...state, companyName: data}))
    setDeclarationChecked = (data) => this.setState(state => ({...state, declarationChecked: data}))

    setPassword = (data) => this.setState(state => ({...state, password: data}))
    setConfirmPassword = (data) => this.setState(state => ({...state, confirmPassword: data}))

    getPhoneNumberMask = (text) => {
        if (!text || text.length <= 10) {
            return '(00) 0000-0000'
        } else {
            return '(00) 00000-0000'
        }
    }

    isValid = (name, value) => {
        switch (name) {
            case 'name':
                return ![null, undefined, ''].includes(value) && value.split(' ').length > 1 && value.split(' ')[1] !== ''
            case 'phone':
                return ![null, undefined, ''].includes(value) && numberUnmasker(value, this.getPhoneNumberMask(value)).length >= 10
            case 'email':
                return ![null, undefined, ''].includes(value) && /@\w+\./g.test(value)
            case 'confirmEmail':
                return ![null, undefined, ''].includes(value) && /@\w+\./g.test(value) && this.state.email === value
            case 'confirmPassword':
                return ![null, undefined, ''].includes(value) && this.state.password === value
            default:
                return true
        }
    }

    // the field must be a string with one of the states
    onValidate = (field, value) => {
        if (!this.isValid(field, value)) {
            this.state.errors[field] = this.errorMessages[field]
        } else {
            delete this.state.errors[field]
        }
        this.setErrors({...this.state.errors})
    }

    onSubmitForm = async () => {
        const data = {
            partner: this.props.partner ? this.props.partner : null,
            shared_by: this.props.sharedBy ? this.props.sharedBy : null,
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
            Linking.openURL(Linking.makeUrl(paths.login().asUrl))
        }
    }

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

    componentWillUnmount = () => {
        this._ismounted = false
    }

    renderMobile = () => {
        return (
            <OnboardingContainer>
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
            </OnboardingContainer>
        )
    }

    renderWeb = () => {
        return (
            <OnboardingContainer step={this.state.step}>
                <OnboardingLogo src="/complete_logo.png" showLogo={this.state.showLogo} slideLogo={this.state.slideLogo} step={this.state.step}/>
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
            </OnboardingContainer>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ }), actions)(Onboarding);