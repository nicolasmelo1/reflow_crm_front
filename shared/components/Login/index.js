import React, { createRef } from 'react'
import { View, Text, TextInput } from 'react-native'
import Router from 'next/router'
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap'
import { LoginInput, LoginButton, LoginButtonText } from '../../styles/Login'
import actions from '../../redux/actions'
import { strings, errors, paths } from '../../utils/constants'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.passwordRef = createRef()
        this.emailRef = createRef()
        this.state = {
            notification: {
                variant: '',
                message: '',
            },
            email: '',
            password: ''
        }
    }

    async handleLogin() { 
        this.state.email = (this.state.email == '' && this.emailRef.current && this.emailRef.current.value ) ? this.emailRef.current.value : this.state.email
        this.state.password = (this.state.password == '' && this.passwordRef.current && this.passwordRef.current.value ) ? this.passwordRef.current.value : this.state.password
        this.props.onAuthenticate(this.state).then(response => {
            if (response.status !== 200) {
                this.props.onAddNotification(errors('pt-br', 'incorrect_pass_or_user'), 'error')
            } else {
                if (process.env['APP'] === 'web'){
                    Router.push(paths.home(this.props.login.primaryForm))
                } else {
                    this.props.setRouter('data')
                }
                //Router.push(paths.home(this.props.login.primaryForm))
            }
        })
    }

    renderWeb() {
        return (
            <div>
                <h2>Login Reflow</h2>
                <Form>
                    <Form.Group>
                        <Form.Label>{strings['pt-br']['emailLoginLabel']}</Form.Label>
                        <Form.Control required ref={this.emailRef} required value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{strings['pt-br']['passLoginLabel']}</Form.Label>
                        <Form.Control required ref={this.passwordRef} type='password' value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                    </Form.Group>
                    <Button type="submit" onClick={e => this.handleLogin()}>{strings['pt-br']['submitButtonLabel']}</Button>
                </Form>
            </div>
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
