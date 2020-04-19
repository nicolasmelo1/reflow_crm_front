import React, { createRef } from 'react'
import { View } from 'react-native'
import Router from 'next/router'
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap'
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

    async handleLogin(e) { 
        e.preventDefault()
        this.state.email = (this.state.email == '') ? this.emailRef.current.value : this.state.email
        this.state.password = (this.state.password == '') ? this.passwordRef.current.value : this.state.password
        this.props.onAuthenticate(this.state).then(response => {
            if (response.status !== 200) {
                this.props.onAddNotification(errors('pt-br', 'incorrect_pass_or_user'), 'error')
            } else {
                Router.push(paths.home(this.props.login.primaryForm))
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
                    <Button type="submit" onClick={e => this.handleLogin(e)}>{strings['pt-br']['submitButtonLabel']}</Button>
                </Form>
            </div>
        )
    }

    renderMobile() {
        return (
            <View>
                
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
