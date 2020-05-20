import React from 'react'
import { View } from 'react-native'
import { strings } from '../../utils/constants'
import { 
    OnboardingLabel,
    OnboardingRequiredLabel,
    OnboardingNonRequiredFieldMessage,
    OnboardingInput,
    OnboardingError,
    OnboardingFormContainer,
    OnboardingDeclarationInput,
    OnboardingDeclarationLabel, 
    OnboardingContinueButton,
    OnboardingGoBackButton,
    OnboardingBottomButtonsContainer
} from '../../styles/Onboarding'


/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const FirstStepForm = (props) => {
    const continueButtonDisabled = () => {
        return !props.declarationChecked || props.errors.hasOwnProperty('name') || props.errors.hasOwnProperty('email') || 
                props.errors.hasOwnProperty('confirmEmail') || props.name === '' || props.email === '' || props.confirmEmail === ''
    }

    const renderMobile = () => {
        return (
            <OnboardingFormContainer showForm={props.showForm}>
                <OnboardingLabel>{strings['pt-br']['onboardingNameAndLastNameLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                <OnboardingInput
                    error={props.errors.hasOwnProperty('name')} 
                    type='text' 
                    value={props.name} 
                    onChange={e=> {
                        props.onValidate('name', e.target.value)
                        props.setName(e.target.value)
                    }} 
                    onBlur={e => {props.onValidate('name', e.target.value)}}
                />
                <OnboardingError>{props.errors.hasOwnProperty('name') ? props.errors['name'] : ''}</OnboardingError>
                <OnboardingLabel>{strings['pt-br']['onboardingEmailLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                <OnboardingInput 
                    error={props.errors.hasOwnProperty('email')} 
                    type='text' 
                    value={props.email} 
                    onChange={e=> {
                        props.onValidate('email', e.target.value)
                        props.setEmail(e.target.value)
                    }}
                    onBlur={e => {props.onValidate('email', e.target.value)}}
                />
                <OnboardingError>{props.errors.hasOwnProperty('email') ? props.errors['email'] : ''}</OnboardingError>
                <OnboardingLabel>{strings['pt-br']['onboardingConfirmEmailLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                <OnboardingInput 
                    error={props.errors.hasOwnProperty('confirmEmail')} 
                    type='text' 
                    value={props.confirmEmail} 
                    onChange={e=> {
                        props.onValidate('confirmEmail', e.target.value)
                        props.setConfirmEmail(e.target.value)
                    }}
                    onBlur={e => {props.onValidate('confirmEmail', e.target.value)}}
                />
                <OnboardingError>{props.errors.hasOwnProperty('confirmEmail') ? props.errors['confirmEmail'] : ''}</OnboardingError>
                <OnboardingLabel>{strings['pt-br']['onboardingCompanyNameLabel']}</OnboardingLabel>
                <OnboardingInput type='text' value={props.companyName} onChange={e=> {props.setCompanyName(e.target.value)}}/>
                <OnboardingNonRequiredFieldMessage>{strings['pt-br']['onboardingNoCompanyNameMessage']}</OnboardingNonRequiredFieldMessage>
                <OnboardingDeclarationLabel>
                    <OnboardingDeclarationInput type="checkbox" checked={props.declarationChecked} onChange={e => props.setDeclarationChecked(!props.declarationChecked)}/>
                    &nbsp;{strings['pt-br']['onboardingFirstPartDeclarationLabel']}
                    <a href="https://www.reflow.com.br/termo-de-uso" style={{ color: '#0dbf7e'}} target="_blank">
                        {strings['pt-br']['onboardingTermsOfUsageDeclarationLabel']}
                    </a>{strings['pt-br']['onboardingSecondPartDeclarationLabel']}
                    <a href="https://www.reflow.com.br/privacidade" style={{ color: '#0dbf7e'}} target="_blank">
                        {strings['pt-br']['onboardingPrivacyDeclarationLabel']}
                    </a>{strings['pt-br']['onboardingThirdPartDeclarationLabel']}
                </OnboardingDeclarationLabel>
                <OnboardingBottomButtonsContainer> 
                    <OnboardingGoBackButton onClick={e=> props.redirectToLogin()}>
                        {strings['pt-br']['onboardingLoginButtonLabel']}
                    </OnboardingGoBackButton>
                    <OnboardingContinueButton disabled={continueButtonDisabled()} onClick={e=> props.setStep(1)}>
                        {strings['pt-br']['onboardingCOntinueButtonLabel']}
                    </OnboardingContinueButton>
                </OnboardingBottomButtonsContainer>
            </OnboardingFormContainer>
        )
    }

    const renderWeb = () => {
        return (
            <OnboardingFormContainer showForm={props.showForm}>
                <OnboardingLabel>{strings['pt-br']['onboardingNameAndLastNameLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                <OnboardingInput
                    error={props.errors.hasOwnProperty('name')} 
                    type='text' 
                    value={props.name} 
                    onChange={e=> {
                        props.onValidate('name', e.target.value)
                        props.setName(e.target.value)
                    }} 
                    onBlur={e => {props.onValidate('name', e.target.value)}}
                />
                <OnboardingError>{props.errors.hasOwnProperty('name') ? props.errors['name'] : ''}</OnboardingError>
                <OnboardingLabel>{strings['pt-br']['onboardingEmailLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                <OnboardingInput 
                    error={props.errors.hasOwnProperty('email')} 
                    type='text' 
                    value={props.email} 
                    onChange={e=> {
                        props.onValidate('email', e.target.value)
                        props.setEmail(e.target.value)
                    }}
                    onBlur={e => {props.onValidate('email', e.target.value)}}
                />
                <OnboardingError>{props.errors.hasOwnProperty('email') ? props.errors['email'] : ''}</OnboardingError>
                <OnboardingLabel>{strings['pt-br']['onboardingConfirmEmailLabel']}<OnboardingRequiredLabel>*</OnboardingRequiredLabel></OnboardingLabel>
                <OnboardingInput 
                    error={props.errors.hasOwnProperty('confirmEmail')} 
                    type='text' 
                    value={props.confirmEmail} 
                    onChange={e=> {
                        props.onValidate('confirmEmail', e.target.value)
                        props.setConfirmEmail(e.target.value)
                    }}
                    onBlur={e => {props.onValidate('confirmEmail', e.target.value)}}
                />
                <OnboardingError>{props.errors.hasOwnProperty('confirmEmail') ? props.errors['confirmEmail'] : ''}</OnboardingError>
                <OnboardingLabel>{strings['pt-br']['onboardingCompanyNameLabel']}</OnboardingLabel>
                <OnboardingInput type='text' value={props.companyName} onChange={e=> {props.setCompanyName(e.target.value)}}/>
                <OnboardingNonRequiredFieldMessage>{strings['pt-br']['onboardingNoCompanyNameMessage']}</OnboardingNonRequiredFieldMessage>
                <OnboardingDeclarationLabel>
                    <OnboardingDeclarationInput type="checkbox" checked={props.declarationChecked} onChange={e => props.setDeclarationChecked(!props.declarationChecked)}/>
                    &nbsp;{strings['pt-br']['onboardingFirstPartDeclarationLabel']}
                    <a href="https://www.reflow.com.br/termo-de-uso" style={{ color: '#0dbf7e'}} target="_blank">
                        {strings['pt-br']['onboardingTermsOfUsageDeclarationLabel']}
                    </a>{strings['pt-br']['onboardingSecondPartDeclarationLabel']}
                    <a href="https://www.reflow.com.br/privacidade" style={{ color: '#0dbf7e'}} target="_blank">
                        {strings['pt-br']['onboardingPrivacyDeclarationLabel']}
                    </a>{strings['pt-br']['onboardingThirdPartDeclarationLabel']}
                </OnboardingDeclarationLabel>
                <OnboardingBottomButtonsContainer> 
                    <OnboardingGoBackButton onClick={e=> props.redirectToLogin()}>
                        {strings['pt-br']['onboardingLoginButtonLabel']}
                    </OnboardingGoBackButton>
                    <OnboardingContinueButton disabled={continueButtonDisabled()} onClick={e=> props.setStep(1)}>
                        {strings['pt-br']['onboardingCOntinueButtonLabel']}
                    </OnboardingContinueButton>
                </OnboardingBottomButtonsContainer>
            </OnboardingFormContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FirstStepForm