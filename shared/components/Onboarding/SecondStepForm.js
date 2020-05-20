import React, {useState} from 'react'
import { View } from 'react-native'
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
    const [visiblePassword, setVisiblePassword] = useState(false)

    const submitButtonDisabled = () => {
        return props.errors.hasOwnProperty('confirmPassword') || props.password === '' || props.confirmPassword === ''
    }

    const renderMobile = () => {
        return (
            <View></View>
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