import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Router from 'next/router'
import { connect } from 'react-redux';
import actions from '../../redux/actions'
import { strings, paths, errors } from '../../utils/constants'
import config from '../../config'
import { 
    OnboardingLogo,
    OnboardingContainer,
    OnboardingLabel,
    OnboardingRequiredLabel,
    OnboardingNonRequiredFieldMessage,
    OnboardingInput,
    OnboardingError,
    OnboardingFormContainer,
    OnboardingDeclarationInput,
    OnboardingDeclarationLabel, 
    OnboardingContinueButton,
    OnboardingSubmitButton,
    OnboardingVisualizePasswordLabel,
    OnboardingGoBackButton,
    OnboardingBottomButtonsContainer
} from '../../styles/Onboarding'
import { View } from 'react-native'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class Onboarding extends React.Component {
    constructor(props) {
        super(props)
        
        this.formularySteps = ['set-email', 'set-password']
        this.errorMessages = {
            name: strings['pt-br']['onboardingNameAndLastNameError'],
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
            email: '',
            confirmEmail: '',
            companyName: '',
            declarationChecked: false,
            password: '',
            confirmPassword: '',
            visiblePassword: false
        }
    }
    
    setSlideLogo = (data) => this.setState(state => state.slideLogo = data)
    setShowLogo = (data) => this.setState(state => state.showLogo = data)
    setShowForm = (data) => this.setState(state => state.showForm = data)
    setStep = (data) => this.setState(state => state.step = data)

    setErrors = (data) => this.setState(state => ({...state, errors: data}))

    setName = (data) => this.setState(state => ({...state, name: data}))
    setEmail = (data) => this.setState(state => ({...state, email: data}))
    setConfirmEmail = (data) => this.setState(state => ({...state, confirmEmail: data}))
    setCompanyName = (data) => this.setState(state => ({...state, companyName: data}))
    setDeclarationChecked = (data) => this.setState(state => ({...state, declarationChecked: data}))

    setPassword = (data) => this.setState(state => ({...state, password: data}))
    setConfirmPassword = (data) => this.setState(state => ({...state, confirmPassword: data}))
    setVisiblePassword = (data) => this.setState(state => ({...state, visiblePassword: data}))

    isValid = (name, value) => {
        switch (name) {
            case 'name':
                return ![null, undefined, ''].includes(value) && value.split(' ').length > 1 && value.split(' ')[1] !== ''
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
                Router.push(paths.login(), paths.login(), {shallow: true})
            }
        })
    }

    redirectToLogin = () => {
        if (process.env['APP'] === 'web') {
            Router.push(paths.login(), paths.login(), { shallow: true })
        }
    }

    continueButtonDisabled = () => {
        return !this.state.declarationChecked || this.state.errors.hasOwnProperty('name') || this.state.errors.hasOwnProperty('email') || 
                this.state.errors.hasOwnProperty('confirmEmail') || this.state.name === '' || this.state.email === '' || this.state.confirmEmail === ''
    }

    submitButtonDisabled = () => {
        return this.state.errors.hasOwnProperty('confirmPassword') || this.state.password === '' || this.state.confirmPassword === ''
    }

    componentDidMount = () => {
        this._ismounted = true
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

    componentWillUnmount = () => {
        this._ismounted = false
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <OnboardingContainer step={this.state.step}>
                <OnboardingLogo src="/complete_logo.png" showLogo={this.state.showLogo} slideLogo={this.state.slideLogo}/>
                {this.formularySteps[this.state.step] === 'set-email' ? (
                    <OnboardingFormContainer showForm={this.state.showForm}>
                        <OnboardingLabel>{strings['pt-br']['onboardingNameAndLastNameLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                        <OnboardingInput
                            error={this.state.errors.hasOwnProperty('name')} 
                            type='text' 
                            value={this.state.name} 
                            onChange={e=> {
                                this.onValidate('name', e.target.value)
                                this.setName(e.target.value)
                            }} 
                            onBlur={e => {this.onValidate('name', e.target.value)}}
                        />
                        <OnboardingError>{this.state.errors.hasOwnProperty('name') ? this.state.errors['name'] : ''}</OnboardingError>
                        <OnboardingLabel>{strings['pt-br']['onboardingEmailLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                        <OnboardingInput 
                            error={this.state.errors.hasOwnProperty('email')} 
                            type='text' 
                            value={this.state.email} 
                            onChange={e=> {
                                this.onValidate('email', e.target.value)
                                this.setEmail(e.target.value)
                            }}
                            onBlur={e => {this.onValidate('email', e.target.value)}}
                        />
                        <OnboardingError>{this.state.errors.hasOwnProperty('email') ? this.state.errors['email'] : ''}</OnboardingError>
                        <OnboardingLabel>{strings['pt-br']['onboardingConfirmEmailLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                        <OnboardingInput 
                            error={this.state.errors.hasOwnProperty('confirmEmail')} 
                            type='text' 
                            value={this.state.confirmEmail} 
                            onChange={e=> {
                                this.onValidate('confirmEmail', e.target.value)
                                this.setConfirmEmail(e.target.value)
                            }}
                            onBlur={e => {this.onValidate('confirmEmail', e.target.value)}}
                        />
                        <OnboardingError>{this.state.errors.hasOwnProperty('confirmEmail') ? this.state.errors['confirmEmail'] : ''}</OnboardingError>
                        <OnboardingLabel>{strings['pt-br']['onboardingCompanyNameLabel']}</OnboardingLabel>
                        <OnboardingInput type='text' value={this.state.companyName} onChange={e=> {this.setCompanyName(e.target.value)}}/>
                        <OnboardingNonRequiredFieldMessage>{strings['pt-br']['onboardingNoCompanyNameMessage']}</OnboardingNonRequiredFieldMessage>
                        <OnboardingDeclarationLabel>
                            <OnboardingDeclarationInput type="checkbox" checked={this.state.declarationChecked} onChange={e => this.setDeclarationChecked(!this.state.declarationChecked)}/>
                            &nbsp;{strings['pt-br']['onboardingFirstPartDeclarationLabel']}
                            <a href="https://www.reflow.com.br/termo-de-uso" style={{ color: '#0dbf7e'}} target="_blank">
                                {strings['pt-br']['onboardingTermsOfUsageDeclarationLabel']}
                            </a>{strings['pt-br']['onboardingSecondPartDeclarationLabel']}
                            <a href="https://www.reflow.com.br/privacidade" style={{ color: '#0dbf7e'}} target="_blank">
                                {strings['pt-br']['onboardingPrivacyDeclarationLabel']}
                            </a>{strings['pt-br']['onboardingThirdPartDeclarationLabel']}
                        </OnboardingDeclarationLabel>
                        <OnboardingBottomButtonsContainer> 
                            <OnboardingGoBackButton onClick={e=> this.redirectToLogin()}>
                                {strings['pt-br']['onboardingLoginButtonLabel']}
                            </OnboardingGoBackButton>
                            <OnboardingContinueButton disabled={this.continueButtonDisabled()} onClick={e=> this.setStep(1)}>
                                {strings['pt-br']['onboardingCOntinueButtonLabel']}
                            </OnboardingContinueButton>
                        </OnboardingBottomButtonsContainer>
                    </OnboardingFormContainer>
                ) : (
                    <OnboardingFormContainer showForm={this.state.showForm}>
                        <OnboardingLabel>{strings['pt-br']['onboardingPasswordLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                        <OnboardingInput
                            error={this.state.errors.hasOwnProperty('password')} 
                            type={this.state.visiblePassword ? 'text' : 'password'}
                            value={this.state.password} 
                            onChange={e=> {
                                this.onValidate('password', e.target.value)
                                this.setPassword(e.target.value)
                            }} 
                            onBlur={e => {this.onValidate('password', e.target.value)}}
                        />
                        <OnboardingError>{this.state.errors.hasOwnProperty('password') ? this.state.errors['password'] : ''}</OnboardingError>
                        <OnboardingLabel>{strings['pt-br']['onboardingConfirmPasswordLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                        <OnboardingInput 
                            error={this.state.errors.hasOwnProperty('confirmPassword')} 
                            type={this.state.visiblePassword ? 'text' : 'password'}
                            value={this.state.confirmPassword} 
                            onChange={e=> {
                                this.onValidate('confirmPassword', e.target.value)
                                this.setConfirmPassword(e.target.value)
                            }}
                            onBlur={e => {this.onValidate('confirmPassword', e.target.value)}}
                        />
                        <OnboardingError>{this.state.errors.hasOwnProperty('confirmPassword') ? this.state.errors['confirmPassword'] : ''}</OnboardingError>
                        <OnboardingVisualizePasswordLabel>
                            <input style={{display:'none'}} type="checkbox" checked={this.state.visiblePassword} onChange={e => this.setVisiblePassword(!this.state.visiblePassword)}/>
                            <FontAwesomeIcon icon={this.state.visiblePassword ? 'eye-slash' : 'eye'}/>
                            &nbsp;{this.state.visiblePassword ? strings['pt-br']['onboardingHidePasswordLabel'] : strings['pt-br']['onboardingShowPasswordLabel']}
                        </OnboardingVisualizePasswordLabel>
                        <OnboardingBottomButtonsContainer> 
                            <OnboardingGoBackButton onClick={e=> this.setStep(0)}>
                                {strings['pt-br']['onboardingGobackButtonLabel']}
                            </OnboardingGoBackButton>
                            <OnboardingSubmitButton disabled={this.submitButtonDisabled()} onClick={e=> this.onSubmitForm()}>
                                {strings['pt-br']['onboardingSubmitButtonLabel']}
                            </OnboardingSubmitButton>
                        </OnboardingBottomButtonsContainer>
                    </OnboardingFormContainer>
                )}
            </OnboardingContainer>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ }), actions)(Onboarding);