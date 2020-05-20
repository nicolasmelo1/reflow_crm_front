import React from 'react'
import { View } from 'react-native'
import Router from 'next/router'
import { strings, paths } from '../../utils/constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { connect } from 'react-redux';
import actions from '../../redux/actions'
import { 
    ChangePasswordInput,
    ChangePasswordLabel,
    ChangePasswordError,
    ChangePasswordLogo,
    ChangePasswordContainer,
    ChangePasswordFormContainer,
    ChangePasswordSubmitButton,
    ChangePasswordVisualizePasswordLabel
 } from '../../styles/ChangePassword'


/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class ChangePassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visiblePassword: false,
            errors: {},
            currentPassword: (this.props.temporaryPassword) ? this.props.temporaryPassword : '',
            newPassword: '',
            confirmNewPassword: ''
        }
    }

    setVisiblePassword = (data) => this.setState(state => ({...state, visiblePassword: data}))

    setConfirmNewPassword = (data) => this.setState(state => ({...state, confirmNewPassword: data}))
    setNewPassword = (data) => this.setState(state => ({...state, newPassword: data}))
    setCurrentPassword = (data) => this.setState(state => ({...state, currentPassword: data}))
    setErrors = (data) => this.setState(state => ({...state, errors: data}))

    errorMessages = {
        currentPassword: strings['pt-br']['changePasswordTemporaryPasswordError'],
        newPassword: strings['pt-br']['changePasswordNewPasswordError'],
        confirmNewPassword: strings['pt-br']['changePasswordConfirmNewPasswordError']
    }

    isValid = (name, value) => {
        switch (name) {
            case 'currentPassword':
                return ![null, undefined, ''].includes(value)
            case 'newPassword':
                return ![null, undefined, ''].includes(value)
            case 'confirmNewPassword':
                return ![null, undefined, ''].includes(value) && this.state.newPassword === value
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

    submitButtonDisabled = () => {
        return this.state.errors.hasOwnProperty('confirmPassword') || this.state.errors.hasOwnProperty('newPassword') || 
               this.state.errors.hasOwnProperty('currentPassword') || this.state.confirmNewPassword === '' || this.state.newPassword === '' || 
               this.state.confirmNewPassword === ''
    }

    redirectToLogin = () => {
        if (process.env['APP'] === 'web') {
            Router.push(paths.login(), paths.login(), { shallow: true })
        }
    }

    onSubmit = () => {
        const data = {
            temporary_password: this.state.currentPassword,
            password: this.state.newPassword
        }

        this.props.onUpdateUserPassword(data).then(response => {
            if(response && response.status === 200) {
                this.redirectToLogin()
            } else {
                this.props.onAddNotification(strings['pt-br']['changePasswordUnknownError'], 'error')
                setInterval(() => {
                    if (this._ismounted) this.redirectToLogin()
                }, 3000)
            }
        })
    }

    componentDidMount = () => {
        this._ismounted = true
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
            <ChangePasswordContainer>
                <ChangePasswordLogo src="/complete_logo.png"/>
                <ChangePasswordFormContainer>
                    <ChangePasswordLabel>{strings['pt-br']['changePasswordTemporaryPasswordLabel']}</ChangePasswordLabel>
                    <ChangePasswordInput 
                    error={this.state.errors.hasOwnProperty('currentPassword')} 
                    type={this.state.visiblePassword ? 'text' : 'password'}
                    value={this.state.currentPassword} 
                    onChange={e=> {
                        this.onValidate('currentPassword', e.target.value)
                        this.setCurrentPassword(e.target.value)
                    }} 
                    onBlur={e => {this.onValidate('currentPassword', e.target.value)}}
                    />
                    <ChangePasswordError>{this.state.errors.hasOwnProperty('currentPassword') ? this.state.errors['currentPassword'] : ''}</ChangePasswordError>
                </ChangePasswordFormContainer>
                <ChangePasswordFormContainer>
                    <ChangePasswordLabel>{strings['pt-br']['changePasswordNewPasswordLabel']}</ChangePasswordLabel>
                    <ChangePasswordInput
                    error={this.state.errors.hasOwnProperty('newPassword')} 
                    type={this.state.visiblePassword ? 'text' : 'password'}
                    value={this.state.newPassword} 
                    onChange={e=> {
                        this.onValidate('newPassword', e.target.value)
                        this.setNewPassword(e.target.value)
                    }} 
                    onBlur={e => {this.onValidate('newPassword', e.target.value)}}
                    />
                    <ChangePasswordError>{this.state.errors.hasOwnProperty('newPassword') ? this.state.errors['newPassword'] : ''}</ChangePasswordError>
                    <ChangePasswordLabel>{strings['pt-br']['changePasswordConfirmNewPasswordLabel']}</ChangePasswordLabel>
                    <ChangePasswordInput
                    error={this.state.errors.hasOwnProperty('confirmNewPassword')} 
                    type={this.state.visiblePassword ? 'text' : 'password'} 
                    value={this.state.confirmNewPassword} 
                    onChange={e=> {
                        this.onValidate('confirmNewPassword', e.target.value)
                        this.setConfirmNewPassword(e.target.value)
                    }} 
                    onBlur={e => {this.onValidate('confirmNewPassword', e.target.value)}}/>
                    <ChangePasswordError>{this.state.errors.hasOwnProperty('confirmNewPassword') ? this.state.errors['confirmNewPassword'] : ''}</ChangePasswordError>
                    <ChangePasswordVisualizePasswordLabel>
                        <input style={{display:'none'}} type="checkbox" checked={this.state.visiblePassword} onChange={e => this.setVisiblePassword(!this.state.visiblePassword)}/>
                        <FontAwesomeIcon icon={this.state.visiblePassword ? 'eye-slash' : 'eye'}/>
                        &nbsp;{this.state.visiblePassword ? strings['pt-br']['changePasswordIsVisiblePassword'] : strings['pt-br']['changePasswordIsNotVisiblePassword']}
                    </ChangePasswordVisualizePasswordLabel>
                </ChangePasswordFormContainer>
                <ChangePasswordSubmitButton disabled={this.submitButtonDisabled()} onClick={e=> this.onSubmit()}>
                    {strings['pt-br']['changePasswordSubmitNewPasswordLabel']}
                </ChangePasswordSubmitButton>
            </ChangePasswordContainer>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}


export default connect(state => ({ }), actions)(ChangePassword);