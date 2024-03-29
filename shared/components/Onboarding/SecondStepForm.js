import React, {useState} from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { strings } from '../../utils/constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Styled from './styles'

/**
 * This is the second step of the formulary. Each step is explained in the Onboarding component.
 * 
 * This step of the onboarding is responsible for handling and holding information about the password of the user.
 * it is actually a really simple component with just 3 fields.
 * 
 * @param {Boolean} showForm - Used just for animating when loading the formulary, when set to True we set the opacity to 1, otherwise the opacity will be 0.
 * @param {Function} onValidate - This does two things:
 * - Checks if a field is valid and 
 * - Sets an error key with its message if the value of the field is invalid.
 * @param {Function} setStep - This changes the state of the current step, if on step 1 renders this formulary, otherwise renders the second step.
 * @param {Object} errors - This object holds all of the errors on the hole formulary. Each key of the object is the name of a field on this formulary
 * and the value of the key is error message.
 * @param {String} password - The password of the user, we use this the other one is just for confirmation to prevent typos
 * @param {Function} setPassword - Function for changing the `password` state.
 * @param {String} confirmPassword - Used to preventing typos, password and confirmPassword should always be equal
 * @param {Function} setConfirmPassword - Function for changing the `confirmPassword` state.
 * @param {Function} onSubmitForm - Submits the formulary data if everything is fine, otherwise gives an error.
 */
const SecondStepForm = (props) => {
    const [passwordIsFocused, setPasswordIsFocused] = useState(false)
    const [confirmPasswordIsFocused, setConfirmPasswordIsFocused] = useState(false)
    const [visiblePassword, setVisiblePassword] = useState(false)
    // ------------------------------------------------------------------------------------------
    /**
     * This is to disable of enable the Submit button of the data. If the data is right the user can submit otherwise
     * the user cannot submmit.
     */
    const submitButtonDisabled = () => {
        return props.errors.hasOwnProperty('confirmPassword') || props.password === '' || props.confirmPassword === ''
    }
    // ------------------------------------------------------------------------------------------
    //########################################################################################//
    const renderMobile = () => {
        return (
            <Styled.OnboardingFormFormContainer showForm={props.showForm} contentContainerStyle={{ alignItems: 'center' }}>
                <Styled.OnboardingFormLabel>{strings['pt-br']['onboardingPasswordLabel']}<Styled.OnboardingFormRequiredLabel>*</Styled.OnboardingFormRequiredLabel></Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput
                    isFocused={passwordIsFocused}
                    secureTextEntry={!visiblePassword} 
                    error={props.errors.hasOwnProperty('password')} 
                    value={props.password}
                    onChange={e=> {
                        props.onValidate('password', e.nativeEvent.text)
                        props.setPassword(e.nativeEvent.text)
                    }} 
                    onFocus={e=>setPasswordIsFocused(true)}
                    onBlur={e => {
                        props.onValidate('password', e.nativeEvent.text)
                        setPasswordIsFocused(false)
                    }}
                />
                <Styled.OnboardingFormError>{props.errors.hasOwnProperty('password') ? props.errors['password'] : ''}</Styled.OnboardingFormError>
                <Styled.OnboardingFormLabel>{strings['pt-br']['onboardingConfirmPasswordLabel']}<Styled.OnboardingFormRequiredLabel>*</Styled.OnboardingFormRequiredLabel></Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput 
                    isFocused={confirmPasswordIsFocused}
                    secureTextEntry={!visiblePassword} 
                    error={props.errors.hasOwnProperty('confirmPassword')} 
                    value={props.confirmPassword} 
                    onChange={e=> {
                        props.onValidate('confirmPassword', e.nativeEvent.text)
                        props.setConfirmPassword(e.nativeEvent.text)
                    }}
                    onFocus={e=>setConfirmPasswordIsFocused(true)}
                    onBlur={e => {
                        props.onValidate('confirmPassword', e.nativeEvent.text)
                        setConfirmPasswordIsFocused(false)
                    }}
                />
                <Styled.OnboardingFormError>{props.errors.hasOwnProperty('confirmPassword') ? props.errors['confirmPassword'] : ''}</Styled.OnboardingFormError>
                <Styled.OnboardingFormVisualizePasswordLabel onPress={e=> setVisiblePassword(!visiblePassword)}>
                    <FontAwesomeIcon icon={visiblePassword ? 'eye-slash' : 'eye'}/>
                    <Text>
                        &nbsp;{visiblePassword ? strings['pt-br']['onboardingHidePasswordLabel'] : strings['pt-br']['onboardingShowPasswordLabel']}
                    </Text>
                </Styled.OnboardingFormVisualizePasswordLabel>
                <Styled.OnboardingFormBottomButtonsContainer> 
                    <Styled.OnboardingFormSubmitButton disabled={submitButtonDisabled()} onPress={e=> props.onSubmitForm()}>
                        <Text>
                        {strings['pt-br']['onboardingSubmitButtonLabel']}
                        </Text>
                    </Styled.OnboardingFormSubmitButton>
                    <Styled.OnboardingFormGoBackButton onPress={e=> props.setStep(0)}>
                        <Text>
                            {strings['pt-br']['onboardingGobackButtonLabel']}
                        </Text>
                    </Styled.OnboardingFormGoBackButton>
                </Styled.OnboardingFormBottomButtonsContainer>
            </Styled.OnboardingFormFormContainer>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <Styled.OnboardingFormFormContainer showForm={props.showForm}>
                <Styled.OnboardingFormLabel>{strings['pt-br']['onboardingPasswordLabel']}<Styled.OnboardingFormRequiredLabel>*</Styled.OnboardingFormRequiredLabel></Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput
                    autoComplete={'whathever'} 
                    error={props.errors.hasOwnProperty('password')} 
                    type={visiblePassword ? 'text' : 'password'}
                    value={props.password} 
                    onChange={e=> {
                        props.onValidate('password', e.target.value)
                        props.setPassword(e.target.value)
                    }} 
                    onBlur={e => {props.onValidate('password', e.target.value)}}
                />
                <Styled.OnboardingFormError>{props.errors.hasOwnProperty('password') ? props.errors['password'] : ''}</Styled.OnboardingFormError>
                <Styled.OnboardingFormLabel>{strings['pt-br']['onboardingConfirmPasswordLabel']}<Styled.OnboardingFormRequiredLabel>*</Styled.OnboardingFormRequiredLabel></Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput 
                    autoComplete={'whathever'} 
                    error={props.errors.hasOwnProperty('confirmPassword')} 
                    type={visiblePassword ? 'text' : 'password'}
                    value={props.confirmPassword} 
                    onChange={e=> {
                        props.onValidate('confirmPassword', e.target.value)
                        props.setConfirmPassword(e.target.value)
                    }}
                    onBlur={e => {props.onValidate('confirmPassword', e.target.value)}}
                />
                <Styled.OnboardingFormError>{props.errors.hasOwnProperty('confirmPassword') ? props.errors['confirmPassword'] : ''}</Styled.OnboardingFormError>
                <Styled.OnboardingFormVisualizePasswordLabel>
                    <input style={{display:'none'}} type="checkbox" checked={visiblePassword} onChange={e => setVisiblePassword(!visiblePassword)}/>
                    <FontAwesomeIcon icon={visiblePassword ? 'eye-slash' : 'eye'}/>
                    &nbsp;{visiblePassword ? strings['pt-br']['onboardingHidePasswordLabel'] : strings['pt-br']['onboardingShowPasswordLabel']}
                </Styled.OnboardingFormVisualizePasswordLabel>
                <Styled.OnboardingFormBottomButtonsContainer> 
                    <Styled.OnboardingFormGoBackButton onClick={e=> props.setStep(0)}>
                        {strings['pt-br']['onboardingGobackButtonLabel']}
                    </Styled.OnboardingFormGoBackButton>
                    <Styled.OnboardingFormSubmitButton disabled={submitButtonDisabled()} onClick={e=> props.onSubmitForm()}>
                        {strings['pt-br']['onboardingSubmitButtonLabel']}
                    </Styled.OnboardingFormSubmitButton>
                </Styled.OnboardingFormBottomButtonsContainer>
            </Styled.OnboardingFormFormContainer>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default SecondStepForm