import React, { createRef } from 'react'
import { View, Text } from 'react-native'
import Router from 'next/router'
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
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
            emailError: '',
            email: process.env.NODE_ENV === 'production' ? '' : 'reflow@reflow.com.br',
            password: process.env.NODE_ENV === 'production' ? '' : 'Mudar123'
        }
    }

    onClickForgotPassword = () => {
        const changePasswordUrl = (process.env['APP']=== 'web') ? window.location.origin + paths.changepassword() + '?temp_pass={}' : ''
        const email = (this.emailRef.current) ? this.emailRef.current.value : this.state.email


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
                Router.push(paths.onboarding(), paths.onboarding(), { shallow: true })
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

                // we set it here because of react, Next.js always constructs the Layout component, so it always pass on the constructor part, React Native on the other hand don't.
                agent.setCompanyId(this.props.login.companyId)

                if (!['', null, undefined].includes(this.props.login.primaryForm)) {
                    if (process.env['APP'] === 'web') {
                        Router.push(paths.home(this.props.login.primaryForm, true), paths.home(this.props.login.primaryForm), { shallow: true })
                    } else {
                        this.props.setIsAuthenticated(true)
                    }

                } else if(isAdmin(this.props.login?.types?.defaults?.profile_type, this.props.login?.user)) {
                    this.props.setAddTemplates(true)
                } else {
                    this.props.onAddNotification(strings['pt-br']['loginNoFormLoginError'],'error')
                    setStorageToken('', '')
                }
            }
        })
    }

    componentDidMount = () => {
        this._ismounted = true
        // Used for anymating, it's better to use key frames, but i don't actually care.
        // (it'll be better if you change it)
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
            <View style={{ 
                top: '25%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{ width: '50%' }}>
                    <Text>Login Reflow</Text>
                    <Text>{strings['pt-br']['loginEmailLabel']}</Text>
                    <LoginInput value={this.state.email} onChangeText={text => this.setState({ email: text })}/>
                    <Text>{strings['pt-br']['loginPassLabel']}</Text>
                    <LoginInput value={this.state.password} onChangeText={text => this.setState({ password: text })}/>
                    <LoginButton onPress={e=> {this.handleLogin(e)}}>
                        <LoginButtonText>
                            {strings['pt-br']['loginSubmitButtonLabel']}
                        </LoginButtonText>
                    </LoginButton>
                </View>
            </View>
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
