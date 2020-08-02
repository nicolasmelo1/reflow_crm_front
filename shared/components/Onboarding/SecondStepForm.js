import React, {useState} from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { strings } from '../../utils/constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { 
    OnboardingLabel,
    OnboardingRequiredLabel,
    OnboardingInput,
    OnboardingError,
    OnboardingFormContainer,
    OnboardingSubmitButton,
    OnboardingVisualizePasswordLabel,
    OnboardingGoBackButton,
    OnboardingBottomButtonsContainer
} from '../../styles/Onboarding'


/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const SecondStepForm = (props) => {
    const [passwordIsFocused, setPasswordIsFocused] = useState(false)
    const [confirmPasswordIsFocused, setConfirmPasswordIsFocused] = useState(false)
    const [visiblePassword, setVisiblePassword] = useState(false)

    const submitButtonDisabled = () => {
        return props.errors.hasOwnProperty('confirmPassword') || props.password === '' || props.confirmPassword === ''
    }

    const renderMobile = () => {
        return (
            <OnboardingFormContainer showForm={props.showForm} contentContainerStyle={{ alignItems: 'center' }}>
                <OnboardingLabel>{strings['pt-br']['onboardingPasswordLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                <OnboardingInput
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
                <OnboardingError>{props.errors.hasOwnProperty('password') ? props.errors['password'] : ''}</OnboardingError>
                <OnboardingLabel>{strings['pt-br']['onboardingConfirmPasswordLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                <OnboardingInput 
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
                <OnboardingError>{props.errors.hasOwnProperty('confirmPassword') ? props.errors['confirmPassword'] : ''}</OnboardingError>
                <OnboardingVisualizePasswordLabel onPress={e=> setVisiblePassword(!visiblePassword)}>
                    <FontAwesomeIcon icon={visiblePassword ? 'eye-slash' : 'eye'}/>
                    <Text>
                        &nbsp;{visiblePassword ? strings['pt-br']['onboardingHidePasswordLabel'] : strings['pt-br']['onboardingShowPasswordLabel']}
                    </Text>
                </OnboardingVisualizePasswordLabel>
                <OnboardingBottomButtonsContainer> 
                    <OnboardingSubmitButton disabled={submitButtonDisabled()} onPress={e=> props.onSubmitForm()}>
                        <Text>
                        {strings['pt-br']['onboardingSubmitButtonLabel']}
                        </Text>
                    </OnboardingSubmitButton>
                    <OnboardingGoBackButton onPress={e=> props.setStep(0)}>
                        <Text>
                            {strings['pt-br']['onboardingGobackButtonLabel']}
                        </Text>
                    </OnboardingGoBackButton>
                </OnboardingBottomButtonsContainer>
            </OnboardingFormContainer>
        )
    }
    

    const renderWeb = () => {
        return (
            <OnboardingFormContainer showForm={props.showForm}>
                <OnboardingLabel>{strings['pt-br']['onboardingPasswordLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                <OnboardingInput
                    error={props.errors.hasOwnProperty('password')} 
                    type={visiblePassword ? 'text' : 'password'}
                    value={props.password} 
                    onChange={e=> {
                        props.onValidate('password', e.target.value)
                        props.setPassword(e.target.value)
                    }} 
                    onBlur={e => {props.onValidate('password', e.target.value)}}
                />
                <OnboardingError>{props.errors.hasOwnProperty('password') ? props.errors['password'] : ''}</OnboardingError>
                <OnboardingLabel>{strings['pt-br']['onboardingConfirmPasswordLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                <OnboardingInput 
                    error={props.errors.hasOwnProperty('confirmPassword')} 
                    type={visiblePassword ? 'text' : 'password'}
                    value={props.confirmPassword} 
                    onChange={e=> {
                        props.onValidate('confirmPassword', e.target.value)
                        props.setConfirmPassword(e.target.value)
                    }}
                    onBlur={e => {props.onValidate('confirmPassword', e.target.value)}}
                />
                <OnboardingError>{props.errors.hasOwnProperty('confirmPassword') ? props.errors['confirmPassword'] : ''}</OnboardingError>
                <OnboardingVisualizePasswordLabel>
                    <input style={{display:'none'}} type="checkbox" checked={visiblePassword} onChange={e => setVisiblePassword(!visiblePassword)}/>
                    <FontAwesomeIcon icon={visiblePassword ? 'eye-slash' : 'eye'}/>
                    &nbsp;{visiblePassword ? strings['pt-br']['onboardingHidePasswordLabel'] : strings['pt-br']['onboardingShowPasswordLabel']}
                </OnboardingVisualizePasswordLabel>
                <OnboardingBottomButtonsContainer> 
                    <OnboardingGoBackButton onClick={e=> props.setStep(0)}>
                        {strings['pt-br']['onboardingGobackButtonLabel']}
                    </OnboardingGoBackButton>
                    <OnboardingSubmitButton disabled={submitButtonDisabled()} onClick={e=> props.onSubmitForm()}>
                        {strings['pt-br']['onboardingSubmitButtonLabel']}
                    </OnboardingSubmitButton>
                </OnboardingBottomButtonsContainer>
            </OnboardingFormContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default SecondStepForm