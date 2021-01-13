import React, { createRef } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Router from 'next/router'
import { connect } from 'react-redux';
import actions from '../../redux/actions'
import dynamicImport from '../../utils/dynamicImport'
import agent from '../../utils/agent'
import { strings, errors, paths } from '../../utils/constants'
import { 
    LoginOnboardingButton,
    LoginContainer, 
    LoginInput, 
    LoginButton, 
    LoginButtonText, 
    LoginFormContainer, 
    LoginLogo, 
    LoginLabel,
    LoginFieldError,
    LoginForgotPassword,
    LoginInputContainer,
    LoginVisualizePasswordIcon
} from '../../styles/Login'

const Spinner = dynamicImport('react-bootstrap', 'Spinner')


/**
 * This component handles the login of a user on the platform, it is important to understand a condition on the user onboarding
 * 
 * WHEN THE USER DOESN'T HAVE ANY FORMULARY DEFINED WE DON'T REDIRECT THE USER, WE OPEN THE COMPONENT FOR HIM TO ADD A NEW TEMPLATE IF HE IS AN ADMIN.
 * 
 * When the user logs in we get the types because sometimes can have issues that the types become undefined. If the types are undefined we cannot
 * validate if he is an admin or not. Retriving the types after the login prevents this from happening and the user can be safelly validated
 * if he's an admin or not.
 * 
 * Besides that is a simple login formulary, it just handles a simple user login.
 * 
 * (on development just set the default reflow email and password so you don't have to type everytime)
 * 
 * @param {Function} setIsAuthenticated - (ONLY MOBILE) - Function to set if the user is authenticated or not. This way we can use React navigation safely,
 * if you want any further explanation, read: https://reactnavigation.org/docs/auth-flow/ 
 * @param {Function} setAddTemplates - This is just a bridge function, it works for us to notify the Layout element that we want to open the 
 * Templates component
 */
class Login extends React.Component {
    constructor(props) {
        super(props)
        this.passwordRef = createRef()
        this.emailRef = createRef()
        this.state = {
            isVerifying: false,
            visualizePassword: false,
            slideLogo: false,
            showLogo: false,
            showForm: false,
            isEmailInputFocused: false,
            isPasswordInputFocused: false,
            emailError: '',
            email: process.env.NODE_ENV === 'production' ? '' : 'reflow@reflow.com.br',
            password: process.env.NODE_ENV === 'production' ? '' : 'Mudar123'
        }
    }

    setIsVerifing = (isVerifying) => this.setState(state => ({...state, isVerifying: isVerifying}))

    /**
     * We don't have any special screen to send the reset password email to the user, we do this directly in the login screen.
     * 
     * Everytime the user requests a new password we say everything went fine (this way we prevent hackers trying to find e-mails so they can
     * brute force)
     * 
     * We just send an error message on two occasions: 
     * - The first is when we could not connect to the server or some server error.
     * - The second is that the email supplied is not a valid email (like, it doesn't contain '@' keyword)
     */
    onClickForgotPassword = () => {
        const changePasswordUrl = (process.env['APP']=== 'web') ? window.location.origin + paths.changepassword().asUrl + '?temp_pass={}' : ''
        const email = (this.emailRef.current?.value) ? this.emailRef.current.value : this.state.email

        if (![null, undefined, ''].includes(email) && /@[A-z\-]+\./g.test(email)) {
            this.props.onForgotPassword(email, changePasswordUrl).then(response => {
                if (response && response.status === 200) {
                    this.props.onAddNotification(strings['pt-br']['loginRedefinePasswordEmailSentSuccess'].replace('{}', email), 'success')
                } else {
                    this.props.onAddNotification(strings['pt-br']['unknownLoginError'], 'error')
                }
            })
        } else {
            this.setState(state => ({ ...state, emailError: strings['pt-br']['loginRedefinePasswordInvalidEmailFieldError'] }))
        }
    }

    /**
     * Just a handy function to redirect the user from the login page to the onboarding page.
     */
    redirectToOnboarding = () => {
        if (this._ismounted) {
            if (process.env['APP'] === 'web') {
                Router.push(paths.onboarding().asUrl, paths.onboarding().asUrl, { shallow: true })
            } else {
                const Linking = require('expo-linking')
                Linking.openURL(Linking.makeUrl(paths.onboarding().asUrl))
            }
        }
    }

    /**
     * Most of this function is explained inside but anyway.
     * 
     * The login cycle is:
     * - We first verify if the password and the email are valid. You will notice that we get both the email and password 
     * from the reference of the field and not always of the state. This is because some browsers store the login username and password.
     * - After veryfing we get the data types so we can use it to validate if the user is an admin or not.
     * - If he has no primaryForm and is a admin, Redirects him to add the templates.
     * - Otherwise set that he's authenticated on mobile, or redirects him directly to the home page in the browser.
     */
    handleLogin = () => { 
        // we use the reference because most browser saves the credentials on the client side, when
        // if this applies, if the user press `enter` it does not enter because the state will not be set
        // since he will not have written anything
        this.state.email = (this.state.email == '' && this.emailRef.current && this.emailRef.current.value ) ? this.emailRef.current.value : this.state.email
        this.state.password = (this.state.password == '' && this.passwordRef.current && this.passwordRef.current.value ) ? this.passwordRef.current.value : this.state.password
        this.setIsVerifing(true)
        this.props.onAuthenticate({ email: this.state.email, password: this.state.password}).then(response => {
            if (!response) {
                this.setIsVerifing(false)
                this.props.onAddNotification(strings['pt-br']['loginUnknownLoginError'],'error')
            } else if (response.status !== 200) {
                this.setIsVerifing(false)
                this.props.onAddNotification(errors('pt-br', 'incorrect_pass_or_user'), 'error')
            } else {
                // force types to be defines when logging in.
                this.props.getDataTypes().then(_ => {
                    // we set it here because of React: Next.js always constructs the Layout component, so 
                    // it always pass on the constructor part, React Native on the other hand usually don't.
                    agent.setCompanyId(this.props.login.companyId)
                    
                    if (!['', null, undefined].includes(this.props.login.primaryForm)) {
                        if (process.env['APP'] === 'web') {
                            Router.push(paths.home().asUrl, paths.home(this.props.login.primaryForm).asUrl, { shallow: true })
                        } else {
                            this.setIsVerifing(false)
                            this.props.setIsAuthenticated(true)
                        }
                    } else {
                        this.setIsVerifing(false)
                        this.props.setAddTemplates(true)
                    }  
                })
            }
        })
    }

    componentDidMount = () => {
        this._ismounted = true
        // Used for animating, it's better to use key frames, but i don't actually care.
        // (it'll be better if you change it)
        if (process.env['APP'] === 'web') {
            setTimeout(() => {
                if (this._ismounted) this.setState(state => state.showLogo = true)
            }, 100)
            setTimeout(() => {
                if (this._ismounted) this.setState(state => state.slideLogo = true)
            }, 1000)
            setTimeout(() => {
                if (this._ismounted) this.setState(state => state.showForm = true)
            }, 1500)
        }
    }

    componentWillUnmount = () => {
        this._ismounted = false
    }
    
    renderMobile() {
        return (
            <LoginContainer >
                <LoginLogo source={process.env['APP'] !== 'web' ? require('../../../mobile/assets/complete_logo.png') : ''}/>
                <LoginFormContainer>
                    <LoginLabel>{strings['pt-br']['loginEmailLabel']}</LoginLabel>
                    <LoginInput type={'text'} 
                        autoCapitalize={'none'}
                        keyboardType={'email-address'}
                        ref={this.emailRef} 
                        isFocused={this.state.isEmailInputFocused}
                        value={this.state.email} 
                        onChange={e => this.setState({ email: e.nativeEvent.text, emailError: '' })} 
                        error={![null, undefined, ''].includes(this.state.emailError)}
                        onFocus={e => this.setState({ isEmailInputFocused: true})}
                        onBlur={e => this.setState({ isEmailInputFocused: false})}
                    />
                    <LoginFieldError>{![null, undefined, ''].includes(this.state.emailError) ? this.state.emailError : ''}</LoginFieldError>
                    <LoginLabel>{strings['pt-br']['loginPassLabel']}</LoginLabel>
                    <LoginInputContainer>
                        <LoginInput 
                            isPassword={true}
                            ref={this.passwordRef} 
                            isFocused={this.state.isPasswordInputFocused}
                            secureTextEntry={!this.state.visualizePassword} 
                            value={this.state.password} 
                            onChange={e => this.setState({ password: e.nativeEvent.text })}
                            onFocus={e => this.setState({ isPasswordInputFocused: true})}
                            onBlur={e => this.setState({ isPasswordInputFocused: false})}
                        />
                        <TouchableOpacity style={{alignItems: 'center', justifyContent:'center', marginLeft: 10, width: 40}} onPress={e=> this.setState(state => ({...state, visualizePassword: !state.visualizePassword}))}>
                            <LoginVisualizePasswordIcon icon={this.state.visualizePassword ? 'eye-slash' : 'eye'} />
                        </TouchableOpacity>
                    </LoginInputContainer>
                    <LoginForgotPassword onPress={e=> this.onClickForgotPassword()}>
                        <Text>
                            {strings['pt-br']['loginRedefinePasswordButtonLabel']}
                        </Text>
                    </LoginForgotPassword>
                    <LoginButton type="submit" onPress={e => {
                        this.handleLogin()
                    }}>
                        <Text>
                            {strings['pt-br']['loginSubmitButtonLabel']}
                        </Text>
                    </LoginButton>
                    <LoginOnboardingButton onPress={e => {
                        this.redirectToOnboarding()
                    }}>
                        <Text>
                            {strings['pt-br']['loginOboardingButtonLabel']}
                        </Text>
                    </LoginOnboardingButton>
                </LoginFormContainer>
            </LoginContainer>
        )
    }

    renderWeb() {
        return (
            <LoginContainer>
                <LoginLogo src="/complete_logo.png" showLogo={this.state.showLogo} slideLogo={this.state.slideLogo }/>
                <LoginFormContainer showForm={this.state.showForm}>
                    <LoginLabel>{strings['pt-br']['loginEmailLabel']}</LoginLabel>
                    <LoginInput type={'text'} name={'email'} ref={this.emailRef} value={this.state.email} onChange={e => this.setState({ email: e.target.value, emailError: '' })} error={![null, undefined, ''].includes(this.state.emailError)}/>
                    <LoginFieldError>{![null, undefined, ''].includes(this.state.emailError) ? this.state.emailError : ''}</LoginFieldError>
                    <LoginLabel>{strings['pt-br']['loginPassLabel']}</LoginLabel>
                    <LoginInputContainer>
                        <LoginInput ref={this.passwordRef} name={'password'} type={this.state.visualizePassword ? 'text' : 'password'} value={this.state.password} onChange={e => this.setState({ password: e.target.value })}/>
                        <LoginVisualizePasswordIcon icon={this.state.visualizePassword ? 'eye-slash' : 'eye'} onClick={e=> this.setState(state => ({...state, visualizePassword: !state.visualizePassword}))}/>
                    </LoginInputContainer>
                    <LoginForgotPassword onClick={e=> this.onClickForgotPassword()}>{strings['pt-br']['loginRedefinePasswordButtonLabel']}</LoginForgotPassword>
                    <LoginButton type="submit" onClick={e => {
                        this.state.isVerifying ? null : this.handleLogin()
                    }}>
                        {this.state.isVerifying ? (<Spinner animation="border" size="sm"/>) : strings['pt-br']['loginSubmitButtonLabel']}
                    </LoginButton>
                    <LoginOnboardingButton onClick={e => {
                        this.redirectToOnboarding()
                    }}>
                        {strings['pt-br']['loginOboardingButtonLabel']}
                    </LoginOnboardingButton>
                </LoginFormContainer>
            </LoginContainer>
        )
    }

    render() {
        if (process.env['APP'] === 'web') {
            return this.renderWeb()
        } else {
            return this.renderMobile()
        }
    }
}


export default connect(state => ({ login: state.login }), actions)(Login);
