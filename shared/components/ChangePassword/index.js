import React from 'react'
import { Modal, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
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
    ChangePasswordVisualizePasswordLabel,
    ChangePasswordHeader,
    ChangePasswordGoBackButton
} from '../../styles/ChangePassword'


/**
 * This component is just used for the user to change the password, the user don't
 * enter here from by any links inside of our platform, but from external links that 
 * he recieve on his email.
 * @param {String} temporaryPassword - Used for automatically setting the temporaryPassword
 * on the currentPassword input.
 * @param {Function} onUpdateUserPassword - This is a react redux action function used for
 * upading the new userPassword.
 * @param {Function} onAddNotification - React redux action function  to set custom notify notification
 * messages.
 * @param {Function} goBack - Go back function to go back to the login page.
 */
class ChangePassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPasswordIsFocused: false,
            newPasswordIsFocused: false,
            confirmNewPasswordIsFocused: false,
            visiblePassword: false,
            errors: {},
            currentPassword: (this.props.temporaryPassword) ? this.props.temporaryPassword : '',
            newPassword: '',
            confirmNewPassword: ''
        }
    }
    setCurrentPasswordIsFocused = (data) => this.setState(state => ({...state, currentPasswordIsFocused: data}))
    setNewPasswordIsFocused = (data) => this.setState(state => ({...state, newPasswordIsFocused: data}))
    setConfirmNewPasswordIsFocused = (data) => this.setState(state => ({...state, confirmNewPasswordIsFocused: data}))


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
            Router.push(paths.login().asUrl, paths.login().asUrl, { shallow: true })
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
            <Modal animationType="slide">
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <ChangePasswordContainer>
                        <ChangePasswordHeader>
                            <ChangePasswordGoBackButton onPress={e=> this.props.goBack()}>
                                <FontAwesomeIcon icon={'times'}/>
                            </ChangePasswordGoBackButton>
                        </ChangePasswordHeader>
                        <ChangePasswordLogo source={process.env['APP'] !== 'web' ? require('../../../mobile/assets/complete_logo.png') : ''}/>
                        <ChangePasswordFormContainer>
                            <ChangePasswordLabel>{strings['pt-br']['changePasswordTemporaryPasswordLabel']}</ChangePasswordLabel>
                            <ChangePasswordInput 
                            isFocused={this.state.currentPasswordIsFocused}
                            error={this.state.errors.hasOwnProperty('currentPassword')} 
                            secureTextEntry={!this.state.visiblePassword} 
                            value={this.state.currentPassword} 
                            onChange={e=> {
                                this.onValidate('currentPassword', e.nativeEvent.text)
                                this.setCurrentPassword(e.nativeEvent.text)
                            }} 
                            onFocus={e=> this.setCurrentPasswordIsFocused(true)}
                            onBlur={e => {
                                this.setCurrentPasswordIsFocused(false)
                                this.onValidate('currentPassword', e.nativeEvent.text)
                            }}
                            />
                            <ChangePasswordError>{this.state.errors.hasOwnProperty('currentPassword') ? this.state.errors['currentPassword'] : ''}</ChangePasswordError>
                        </ChangePasswordFormContainer>
                        <ChangePasswordFormContainer>
                            <ChangePasswordLabel>{strings['pt-br']['changePasswordNewPasswordLabel']}</ChangePasswordLabel>
                            <ChangePasswordInput
                            isFocused={this.state.newPasswordIsFocused}
                            error={this.state.errors.hasOwnProperty('newPassword')} 
                            secureTextEntry={!this.state.visiblePassword} 
                            value={this.state.newPassword} 
                            onChange={e=> {
                                this.onValidate('newPassword', e.nativeEvent.text)
                                this.setNewPassword(e.nativeEvent.text)
                            }} 
                            onFocus={e=> this.setNewPasswordIsFocused(true)}
                            onBlur={e => {
                                this.setNewPasswordIsFocused(false)
                                this.onValidate('newPassword', e.nativeEvent.text)
                            }}
                            />
                            <ChangePasswordError>{this.state.errors.hasOwnProperty('newPassword') ? this.state.errors['newPassword'] : ''}</ChangePasswordError>
                            <ChangePasswordLabel>{strings['pt-br']['changePasswordConfirmNewPasswordLabel']}</ChangePasswordLabel>
                            <ChangePasswordInput
                            isFocused={this.state.confirmNewPasswordIsFocused}
                            error={this.state.errors.hasOwnProperty('confirmNewPassword')} 
                            secureTextEntry={!this.state.visiblePassword} 
                            value={this.state.confirmNewPassword} 
                            onChange={e=> {
                                this.onValidate('confirmNewPassword', e.nativeEvent.text)
                                this.setConfirmNewPassword(e.nativeEvent.text)
                            }} 
                            onFocus={e=> this.setConfirmNewPasswordIsFocused(true)}
                            onBlur={e => {
                                this.setConfirmNewPasswordIsFocused(false)
                                this.onValidate('confirmNewPassword', e.nativeEvent.text)
                            }}/>
                            <ChangePasswordError>{this.state.errors.hasOwnProperty('confirmNewPassword') ? this.state.errors['confirmNewPassword'] : ''}</ChangePasswordError>
                            <ChangePasswordVisualizePasswordLabel onPress={e=> this.setVisiblePassword(!this.state.visiblePassword)}>
                                <FontAwesomeIcon icon={this.state.visiblePassword ? 'eye-slash' : 'eye'}/>
                                <Text>
                                    &nbsp;{this.state.visiblePassword ? strings['pt-br']['changePasswordIsVisiblePassword'] : strings['pt-br']['changePasswordIsNotVisiblePassword']}
                                </Text>
                            </ChangePasswordVisualizePasswordLabel>
                        </ChangePasswordFormContainer>
                        <ChangePasswordSubmitButton disabled={this.submitButtonDisabled()} onPress={e=> this.onSubmit()}>
                            <Text>
                                {strings['pt-br']['changePasswordSubmitNewPasswordLabel']}
                            </Text>
                        </ChangePasswordSubmitButton>
                    </ChangePasswordContainer>
                </TouchableWithoutFeedback>
            </Modal>
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