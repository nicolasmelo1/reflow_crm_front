import React from 'react'
import actions from '../../redux/actions'
import dynamicImport from '../../utils/dynamicImport'
import generateUUID from '../../utils/generateUUID'
import agent from '../../utils/agent'
import { numberUnmasker } from '../../utils/numberMasker'
import getReflowVisitorId from '../../utils/getReflowVisitorId'
import { strings, paths, errors } from '../../utils/constants'
import FirstStepForm from './FirstStepForm'
import SecondStepForm from './SecondStepForm'
import Styled from './styles'
import SpreadsheetUploader from './SpreadsheetUploader'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const connect = dynamicImport('reduxConnect', 'default')
const Router = dynamicImport('next/router')
const Spinner = dynamicImport('react-bootstrap', 'Spinner')

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
        
        this.visitorId = getReflowVisitorId()
        if (['', null, undefined].includes(this.visitorId)) {
            this.visitorId = generateUUID()
        }
        this.formularySteps = ['set-email', 'set-password', 'spreadsheet-uploader']
        this.errorMessages = {
            name: strings['pt-br']['onboardingNameAndLastNameError'],
            phone: strings['pt-br']['onboardingPhoneError'],
            email: strings['pt-br']['onboardingEmailError'],
            confirmEmail: strings['pt-br']['onboardingConfirmEmailError'],
            confirmPassword: strings['pt-br']['onboardingConfirmPasswordError'],
            numberOfEmployees: strings['pt-br']['onboardingInvalidNumberOfEmployees'],
        }
        
        this.state = {
            isUploadingDataFromSpreadsheet: true,
            showFileUploader: false,
            slideLogo: false,
            showLogo: false,
            showForm: false,
            step: this.props.step !== undefined ? this.props.step : 0,
            errors: {},
            name: '',
            phone: '',
            email: '',
            confirmEmail: '',
            companyName: '',
            numberOfEmployees: 0,
            companySector: '',
            declarationChecked: false,
            password: '',
            confirmPassword: '',
        }
    }
    // ------------------------------------------------------------------------------------------
    setIsUploadingDataFromSpreadsheet = (isUploadingDataFromSpreadsheet) => this.setState(state => ({...state, isUploadingDataFromSpreadsheet}))
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
    setNumberOfEmployees = (data) => this.setState(state => ({...state, numberOfEmployees: data}))
    // ------------------------------------------------------------------------------------------
    setCompanySector = (data) => this.setState(state => ({...state, companySector: data}))
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
                return ![null, undefined, ''].includes(value) && /@[A-z\-\_]+\./g.test(value)
            case 'confirmEmail':
                return ![null, undefined, ''].includes(value) && /@[A-z\-\_]+\./g.test(value) && this.state.email === value
            case 'confirmPassword':
                return ![null, undefined, ''].includes(value) && this.state.password === value
            case 'numberOfEmployees':
                return /^[0-9]*$/.test(value)
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
            discount_coupon: this.props.discountCoupon ? this.props.discountCoupon : null,
            company_name: this.state.companyName,
            company_number_of_employees: this.state.numberOfEmployees,
            company_sector: this.state.companySector,
            user_phone: this.state.phone,
            user_first_name: this.state.name.split(' ')[0],
            user_last_name: this.state.name.split(' ').slice(1).join(' '),
            user_email: this.state.email,
            user_password: this.state.password,
            user_visitor_id: this.visitorId
        }

        this.props.onCreateUserAndCompany(data).then(response => {
            if (response && response.status !== 200){
                this.props.onAddNotification(errors('pt-br', response.data.reason).replace('{}', this.state.email), 'error')
            } else if (!response) {
                this.props.onAddNotification(strings['pt-br']['onboardingUnknownError'], 'error')
            } else {
                if (process.env['APP'] === 'web' && window.lintrk) {
                    window.lintrk('track', { 
                        conversion_id: 6503801 
                    })
                    fbq('track', 'CompleteRegistration')
                }
                this.logUserIn()
            }
        })
    }
    // ------------------------------------------------------------------------------------------
    /**
     * After the spreadsheet has been uploaded we will have a delay before redirecting the user and until he can start using the app.
     * 
     * @param {import('axios').AxiosResponse} response - The response from the backend.
     */
    afterSpreadsheetHasBeenSubmitted = (response) => {
        if (response && response.status === 200) {
            console.log('teste')
            this.setIsUploadingDataFromSpreadsheet(true)
            setTimeout(() => {
                this.setIsUploadingDataFromSpreadsheet(false)
                Router.push(paths.home().asUrl, paths.home(response.data.data.primary_form).asUrl, { shallow: true })  
            }, 10000)
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This will log the user into the platform itself so the user will be already logged in when he continue after the step 1.
     */
    logUserIn = () => {
        this.props.onAuthenticate({ 
            email: this.state.email, 
            password: this.state.password
        }).then(response => {
            if (response && response.status === 200) {
                // force types to be defines when logging in.
                this.props.getDataTypes().then(_ => {
                    // we set it here because of React: Next.js always constructs the Layout component, so 
                    // it always pass on the constructor part, React Native on the other hand usually don't.
                    agent.setCompanyId(this.props.login.companyId)
                    
                    if (!['', null, undefined].includes(this.props.login.primaryForm)) {
                        if (process.env['APP'] === 'web') {
                            Router.push(paths.home().asUrl, paths.home(this.props.login.primaryForm).asUrl, { shallow: true })
                        } else {
                            this.props.setIsAuthenticated(true)
                        }
                    } else {
                        this.setStep(2)
                    }  
                })
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
    /**
     * most of the logic here is just for showing a simple but nice animation when the user first opens the formulary.
     * 
     * Also sends an event that the user started filling the onboarding.
     */
    componentDidMount = () => {
        agent.http.ANALYTICS.trackUserStartedOnboarding(this.visitorId)
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
                    numberOfEmployees={this.state.numberOfEmployees}
                    setNumberOfEmployees={this.setNumberOfEmployees}
                    companySector={this.state.companySector}
                    setCompanySector={this.setCompanySector}
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
                <div
                style={{ 
                    backgroundColor: 'transparent', 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'center', 
                    justifyContent: 'center'
                }}
                >
                    <Styled.OnboardingLogo src="/complete_logo.png" showLogo={this.state.showLogo} slideLogo={this.state.slideLogo} step={this.state.step}/>
                </div>
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
                    numberOfEmployees={this.state.numberOfEmployees}
                    setNumberOfEmployees={this.setNumberOfEmployees}
                    companySector={this.state.companySector}
                    setCompanySector={this.setCompanySector}
                    declarationChecked={this.state.declarationChecked}
                    setDeclarationChecked={this.setDeclarationChecked}
                    redirectToLogin={this.redirectToLogin}
                    setStep={this.setStep}
                    />
                ) : this.formularySteps[this.state.step] === 'set-password' ? (
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
                ) : (
                    <Styled.OnboardingFormFormContainer showForm={this.state.showForm}>
                        {this.state.showFileUploader && this.state.isUploadingDataFromSpreadsheet === false ? (
                            <SpreadsheetUploader
                            onBulkCreateFormulary={this.props.onBulkCreateFormulary}
                            types={this.props?.login?.types}
                            setStep={this.setStep}
                            onSubmitData={this.afterSpreadsheetHasBeenSubmitted}
                            />
                        ) : this.state.isUploadingDataFromSpreadsheet ? (
                            <Styled.OnboardingSpreadsheetUploaderLoader>
                                <p>
                                    {strings['pt-br']['onboardingSpreadsheetUploaderLoaderLabel']}
                                </p>
                                <Spinner 
                                animation={'border'} 
                                size={'lg'}
                                style={{
                                    color: '#0dbf7e'
                                }}
                                />
                            </Styled.OnboardingSpreadsheetUploaderLoader>
                        ) : (
                            <Styled.OnboardingSelectTemplateOrUploaderContainer>
                                <Styled.OnboardingSelectTemplateOrUploaderButton
                                onClick={(e) => this.setState(state => ({ ...state, showFileUploader: true}))}
                                >
                                    {strings['pt-br']['onboardingSelectFileButtonLabel']}
                                    <br/>
                                    <FontAwesomeIcon icon={'file-excel'} size="lg"/>
                                </Styled.OnboardingSelectTemplateOrUploaderButton>
                                <Styled.OnboardingSelectTemplateOrUploaderButton
                                onClick={(e) => this.props.setAddTemplates(true)}
                                >
                                    {strings['pt-br']['onboardingSelectTemplateButtonLabel']}
                                    <br/>
                                    <FontAwesomeIcon icon={'shapes'} size="lg"/>
                                </Styled.OnboardingSelectTemplateOrUploaderButton>
                            </Styled.OnboardingSelectTemplateOrUploaderContainer>
                        )}
                    </Styled.OnboardingFormFormContainer>
                )}
            </Styled.OnboardingContainer>
        )
    }
    //########################################################################################//
    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ login: state.login }), actions)(Onboarding)