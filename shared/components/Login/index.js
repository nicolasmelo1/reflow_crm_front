import React, { createRef } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Router from 'next/router'
import { connect } from 'react-redux';
import { Linking } from 'expo'
import actions from '../../redux/actions'
import agent from '../../utils/agent'
import { setStorageToken } from '../../utils/agent/utils'
import isAdmin from '../../utils/isAdmin'
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

/**
 * This component handles the login of a user on the platform, it is important to understand a condition on the user onboarding.
 * WHEN THE USER DOESN'T HAVE ANY FORMULARY DEFINED WE DON'T REDIRECT THE USER, WE OPEN THE COMPONENT FOR HIM TO ADD A NEW TEMPLATE IF HE IS AN ADMIN.
 * 
 * Otherwise this is a simple login formulary, it just handles a simple user login.
 * 
 */
class Login extends React.Component {
    constructor(props) {
        super(props)
        this.passwordRef = createRef()
        this.emailRef = createRef()
        this.state = {
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

    onClickForgotPassword = () => {
        const changePasswordUrl = (process.env['APP']=== 'web') ? window.location.origin + paths.changepassword().asUrl + '?temp_pass={}' : ''
        const email = (this.emailRef.current?.value) ? this.emailRef.current.value : this.state.email

        if (![null, undefined, ''].includes(email) && /@\w+\./g.test(email)) {
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

    redirectToOnboarding = () => {
        if (this._ismounted) {
            if (process.env['APP'] === 'web') {
                Router.push(paths.onboarding(), paths.onboarding().asUrl, { shallow: true })
            } else {
                Linking.openURL(Linking.makeUrl(paths.onboarding().asUrl))
            }
        }
    }

    handleLogin() { 
        // we use the reference because most browser saves the credentials on the client side, when
        // if this applies, if the user press `enter` it does not enter because the state will not be set
        // since he will not have written anything
        this.state.email = (this.state.email == '' && this.emailRef.current && this.emailRef.current.value ) ? this.emailRef.current.value : this.state.email
        this.state.password = (this.state.password == '' && this.passwordRef.current && this.passwordRef.current.value ) ? this.passwordRef.current.value : this.state.password
        this.props.onAuthenticate({ email: this.state.email, password: this.state.password}).then(response => {
            if (!response) {
                this.props.onAddNotification(strings['pt-br']['loginUnknownLoginError'],'error')
            } else if (response.status !== 200) {
                this.props.onAddNotification(errors('pt-br', 'incorrect_pass_or_user'), 'error')
            } else {
                // force types to be defines when logging in.
                this.props.getDataTypes().then(_ => {
                    // we set it here because of react, Next.js always constructs the Layout component, so 
                    // it always pass on the constructor part, React Native on the other hand don't.
                    agent.setCompanyId(this.props.login.companyId)
                    
                    if (!['', null, undefined].includes(this.props.login.primaryForm)) {
                        if (process.env['APP'] === 'web') {
                            Router.push(paths.home().asUrl, paths.home(this.props.login.primaryForm).asUrl, { shallow: true })
                        } else {
                            this.props.setIsAuthenticated(true)
                        }
                    } else {
                        this.props.setAddTemplates(true)
                    }  
                })
            }
        })
    }

    componentDidMount = () => {
        this._ismounted = true
        // Used for anymating, it's better to use key frames, but i don't actually care.
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

    renderWeb() {
        return (
            <LoginContainer>
                <LoginLogo src="/complete_logo.png" showLogo={this.state.showLogo} slideLogo={this.state.slideLogo }/>
                <LoginFormContainer showForm={this.state.showForm}>
                    <LoginLabel>{strings['pt-br']['loginEmailLabel']}</LoginLabel>
                    <LoginInput type={'text'} ref={this.emailRef} value={this.state.email} onChange={e => this.setState({ email: e.target.value, emailError: '' })} error={![null, undefined, ''].includes(this.state.emailError)}/>
                    <LoginFieldError>{![null, undefined, ''].includes(this.state.emailError) ? this.state.emailError : ''}</LoginFieldError>
                    <LoginLabel>{strings['pt-br']['loginPassLabel']}</LoginLabel>
                    <LoginInputContainer>
                        <LoginInput ref={this.passwordRef} type={this.state.visualizePassword ? 'text' : 'password'} value={this.state.password} onChange={e => this.setState({ password: e.target.value })}/>
                        <LoginVisualizePasswordIcon icon={this.state.visualizePassword ? 'eye-slash' : 'eye'} onClick={e=> this.setState(state => ({...state, visualizePassword: !state.visualizePassword}))}/>
                    </LoginInputContainer>
                    <LoginForgotPassword onClick={e=> this.onClickForgotPassword()}>{strings['pt-br']['loginRedefinePasswordButtonLabel']}</LoginForgotPassword>
                    <LoginButton type="submit" onClick={e => {
                        e.preventDefault(); 
                        this.handleLogin()
                    }}>{strings['pt-br']['loginSubmitButtonLabel']}</LoginButton>
                    <LoginOnboardingButton onClick={e => {
                        e.preventDefault(); 
                        this.redirectToOnboarding()
                    }}>
                        {strings['pt-br']['loginOboardingButtonLabel']}
                    </LoginOnboardingButton>
                </LoginFormContainer>
            </LoginContainer>
        )
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

    render() {
        if (process.env['APP'] === 'web') {
            return this.renderWeb()
        } else {
            return this.renderMobile()
        }
    }
}


export default connect(state => ({ login: state.login }), actions)(Login);
