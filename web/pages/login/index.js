import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'next/router'
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import actions from '@shared/redux/actions';
import Notify from '@shared/components/Notify';
import Layout from '@shared/components/Layout';
import { strings, errors, paths } from '@shared/utils/constants'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    async handleLogin(e) { 
        e.preventDefault();
        this.state.email = (this.state.email == '') ? document.querySelector('.email').value : this.state.email
        this.state.password = (this.state.password == '') ? document.querySelector('.password').value : this.state.password
        this.props.onAuthenticate(this.state).then(response => {
            if (response.status !== 200) {
                ReactDOM.render(<Notify variant="danger" message={errors('pt-br', 'incorrect_pass_or_user')}/>, document.querySelector('.notifications-container'));
            } else {
                Router.push(paths.home(this.props.login.primaryForm))
            }
        })
    }

    render() {
        return (
            <Layout title={strings['pt-br']['loginPageTitle']} hideNavBar={true}>
                <h2>Login Reflow</h2>
                <Form>
                    <Form.Group>
                        <Form.Label>{strings['pt-br']['emailLoginLabel']}</Form.Label>
                        <Form.Control className="email" required value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{strings['pt-br']['passLoginLabel']}</Form.Label>
                        <Form.Control className="password" type='password' required value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                    </Form.Group>
                    <Button type="submit" onClick={e => this.handleLogin(e)}>{strings['pt-br']['submitButtonLabel']}</Button>
                </Form>
            </Layout>
        );
    }
}


export default connect(state => ({ errors: state.errors, login: state.login }), actions)(Login);
