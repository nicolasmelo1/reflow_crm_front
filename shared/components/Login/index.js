import React, { createRef } from 'react'
import { View, Text } from 'react-native'
import Router from 'next/router'
import { connect } from 'react-redux';
import actions from '../../redux/actions'
import agent from '../../utils/agent'
import { strings, errors, paths } from '../../utils/constants'
import { 
    LoginContainer, 
    LoginInput, 
    LoginButton, 
    LoginButtonText, 
    LoginFormContainer, 
    LoginLogo, 
    LoginLabel 
} from '../../styles/Login'


class Login extends React.Component {
    constructor(props) {
        super(props)
        this.passwordRef = createRef()
        this.emailRef = createRef()
        this.state = {
            slideLogo: false,
            showLogo: false,
            showForm: false,
            email: process.env.NODE_ENV === 'production' ? '' : 'reflow@reflow.com.br',
            password: process.env.NODE_ENV === 'production' ? '' : 'Mudar123'
        }
    }

    handleLogin() { 
        // we use the reference because most browser saves the credentials on the client side, when
        // if this applies, if the user press `enter` it does not enter because the state will not be set
        // since he will not have written anything
        this.state.email = (this.state.email == '' && this.emailRef.current && this.emailRef.current.value ) ? this.emailRef.current.value : this.state.email
        this.state.password = (this.state.password == '' && this.passwordRef.current && this.passwordRef.current.value ) ? this.passwordRef.current.value : this.state.password
        this.props.onAuthenticate(this.state).then(response => {
            if (!response) {
                this.props.onAddNotification('Parece que aconteceu um erro inesperado','error')
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

                } else {
                    this.props.setAddTemplates(true)
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
                    <LoginLabel>{strings['pt-br']['emailLoginLabel']}</LoginLabel>
                    <LoginInput type={'text'} ref={this.emailRef} value={this.state.email} onChange={e => this.setState({ email: e.target.value })}/>
                    <LoginLabel>{strings['pt-br']['passLoginLabel']}</LoginLabel>
                    <LoginInput type={'text'} ref={this.passwordRef} type='password' value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                    <button type="submit" onClick={e => {
                        e.preventDefault(); 
                        this.handleLogin()
                    }}>{strings['pt-br']['submitButtonLabel']}</button>
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
                    <Text>{strings['pt-br']['emailLoginLabel']}</Text>
                    <LoginInput value={this.state.email} onChangeText={text => this.setState({ email: text })}/>
                    <Text>{strings['pt-br']['passLoginLabel']}</Text>
                    <LoginInput value={this.state.password} onChangeText={text => this.setState({ password: text })}/>
                    <LoginButton onPress={e=> {this.handleLogin(e)}}>
                        <LoginButtonText>
                            {strings['pt-br']['submitButtonLabel']}
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
