import React, { useState } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { strings } from '../../utils/constants'
import { numberMasker } from '../../utils/numberMasker'
import Styled from './styles'

/**
 * This is the first step of the formulary. It is explained in the Onboarding component.
 * 
 * This step of the onboarding is responsible for handling and holding information about the user (It's name, e-mail, phone) and data related about the company
 * (The name).
 * 
 * @param {Function} openLinks - (MOBILE ONLY) - This is a function that will be used when the user tries to open the privacy policy and the terms of usage
 * @param {Boolean} showForm - Used just for animating when loading the formulary, when set to True we set the opacity to 1, otherwise the opacity will be 0.
 * @param {Function} onValidate - This does two things:
 * - Checks if a field is valid and 
 * - Sets an error key with its message if the value of the field is invalid.
 * @param {Object} errors - This object holds all of the errors on the hole formulary. Each key of the object is the name of a field on this formulary
 * and the value of the key is error message.
 * @param {String} name - The full name of the user. For the backend we actually separate the first_name and the last_name but we do this separation
 * when submitting the name
 * @param {Function} setName - Function for changing the `name` in the state of the parent component.
 * @param {String} phone - I think you know why phone numbers should be string (because no int can start with 0, with string we can actually store phone
 * numbers with 0 as the first character). This holds the phone number of the user UNFORMATTED (this is important) It's just the raw string, we format 
 * when displaying the value to the user
 * @param {Function} setPhone - Function for changing the `phone` state.
 * @param {Function} getPhoneNumberMask - In Brazil the phone number can have 8 digits (besides the DDD (a 2 digit number of the region)) or 9 digits. With this
 * we can mask it dynamically.
 * @param {String} email - The email of the user. Since the user can type it wrong we need to actually confirm the email to prevent typos
 * @param {Function} setEmail - Function for changing the `email` state.
 * @param {String} confirmEmail - Similar to `email` props, this one is just for confirmation.
 * @param {Function} setConfirmEmail - Function for changing the `confirmEmail` state.
 * @param {String} companyName - This is the company name state, it is not obligatory since our user sometimes are not company or don't want to type the company name
 * @param {Function} setCompanyName - Function for changing the `companyName` state.
 * @param {Boolean} declarationChecked - This is just for showing if the declaration of terms of usage and privacy policy has been read and checked. This
 * firms with the user a legal contract.
 * @param {Function} setDeclarationChecked - Function for changing the `declarationChecked` state.
 * @param {Function} redirectToLogin - if the user wants he can go back to the login at anytime while filling the formulary.
 * @param {Function} setStep - This changes the state of the current step, if on step 1 renders this formulary, otherwise renders the second step.
 */
const FirstStepForm = (props) => {
    const [phoneIsFocused, setPhoneIsFocused] = useState(false)
    const [nameAndLastNameIsFocused, setNameAndLastNameIsFocused] = useState(false)
    const [emailIsFocused, setEmailIsFocused] = useState(false)
    const [confirmEmailIsFocused, setConfirmEmailIsFocused] = useState(false)
    const [companyNameIsFocused, setCompanyNameIsFocused] = useState(false)
    // ------------------------------------------------------------------------------------------
    /**
     * If we encountered any errors while filling the formulary we prevent the user from continuing to the next step
     * of the onboarding. 
     * 
     * So this function is used to disable the continue button to advance to another step.
     */ 
    const continueButtonDisabled = () => {
        return !props.declarationChecked || props.errors.hasOwnProperty('name') || props.errors.hasOwnProperty('email') || 
                props.errors.hasOwnProperty('phone') || props.errors.hasOwnProperty('confirmEmail') || props.name === '' || 
                props.email === '' || props.confirmEmail === ''
    }
    // ------------------------------------------------------------------------------------------
    //########################################################################################//
    const renderMobile = () => {
        return (
            <Styled.OnboardingFormFormContainer showForm={props.showForm}>
                <Styled.OnboardingFormLabel>{strings['pt-br']['onboardingNameAndLastNameLabel']}<Styled.OnboardingFormRequiredLabel>*</Styled.OnboardingFormRequiredLabel></Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput
                    error={props.errors.hasOwnProperty('name')} 
                    type='text' 
                    isFocused={nameAndLastNameIsFocused}
                    value={props.name} 
                    onChange={e=> {
                        props.onValidate('name', e.nativeEvent.text)
                        props.setName(e.nativeEvent.text)
                    }} 
                    onFocus={e=>setNameAndLastNameIsFocused(true)}
                    onBlur={e => {
                        setNameAndLastNameIsFocused(false)
                        props.onValidate('name', e.nativeEvent.text)
                    }}
                />
                <Styled.OnboardingFormError>{props.errors.hasOwnProperty('name') ? props.errors['name'] : ''}</Styled.OnboardingFormError>
                <Styled.OnboardingFormLabel>{strings['pt-br']['onboardingPhoneLabel']}<Styled.OnboardingFormRequiredLabel>*</Styled.OnboardingFormRequiredLabel></Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput 
                    error={props.errors.hasOwnProperty('phone')} 
                    type='text' 
                    keyboardType={'number-pad'}
                    value={numberMasker(props.phone, props.getPhoneNumberMask(props.phone))} 
                    isFocused={phoneIsFocused}
                    onChange={e=> {
                        props.onValidate('phone', e.nativeEvent.text)
                        props.setPhone(e.nativeEvent.text)
                    }}
                    onBlur={e => {
                        setPhoneIsFocused(false)
                        props.onValidate('phone', e.nativeEvent.text)
                    }}
                />
                <Styled.OnboardingFormError>{props.errors.hasOwnProperty('phone') ? props.errors['phone'] : ''}</Styled.OnboardingFormError>
                <Styled.OnboardingFormLabel>{strings['pt-br']['onboardingEmailLabel']}<Styled.OnboardingFormRequiredLabel>*</Styled.OnboardingFormRequiredLabel></Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput 
                    keyboardType={'email-address'}
                    autoCapitalize='none'
                    error={props.errors.hasOwnProperty('email')} 
                    type='text' 
                    isFocused={emailIsFocused}
                    value={props.email} 
                    onChange={e=> {
                        props.onValidate('email', e.nativeEvent.text)
                        props.setEmail(e.nativeEvent.text)
                    }}
                    onFocus={e=>setEmailIsFocused(true)}
                    onBlur={e => {
                        setEmailIsFocused(false)
                        props.onValidate('email', e.nativeEvent.text)
                    }}
                />
                <Styled.OnboardingFormError>{props.errors.hasOwnProperty('email') ? props.errors['email'] : ''}</Styled.OnboardingFormError>
                <Styled.OnboardingFormLabel>{strings['pt-br']['onboardingConfirmEmailLabel']}<Styled.OnboardingFormRequiredLabel>*</Styled.OnboardingFormRequiredLabel></Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput 
                    keyboardType={'email-address'}
                    autoCapitalize='none'
                    error={props.errors.hasOwnProperty('confirmEmail')} 
                    type='text' 
                    isFocused={confirmEmailIsFocused}
                    value={props.confirmEmail} 
                    onChange={e=> {
                        props.onValidate('confirmEmail', e.nativeEvent.text)
                        props.setConfirmEmail(e.nativeEvent.text)
                    }}
                    onFocus={e=>setConfirmEmailIsFocused(true)}
                    onBlur={e => {
                        setConfirmEmailIsFocused(false)
                        props.onValidate('confirmEmail', e.nativeEvent.text)
                    }}
                />
                <Styled.OnboardingFormError>{props.errors.hasOwnProperty('confirmEmail') ? props.errors['confirmEmail'] : ''}</Styled.OnboardingFormError>
                <Styled.OnboardingFormLabel>{strings['pt-br']['onboardingCompanyNameLabel']}</Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput 
                    type='text' 
                    isFocused={companyNameIsFocused}
                    value={props.companyName} 
                    onChange={e=> {props.setCompanyName(e.nativeEvent.text)}}
                    onFocus={e=> setConfirmEmailIsFocused(true)}
                    onBlur={e => setCompanyNameIsFocused(false)}
                />
                <Styled.OnboardingFormNonRequiredFieldMessage>{strings['pt-br']['onboardingNoCompanyNameMessage']}</Styled.OnboardingFormNonRequiredFieldMessage>
                <Styled.OnboardingFormDeclarationLabel>
                    <Styled.OnboardingFormDeclarationInput type="checkbox" value={props.declarationChecked} onChange={e => props.setDeclarationChecked(!props.declarationChecked)}/>
                    <Text>
                        {strings['pt-br']['onboardingFirstPartDeclarationLabel']}
                    </Text>
                    <TouchableOpacity onPress={e=> {props.openLinks('https://www.reflow.com.br/termo-de-uso')}}>
                        <Text style={{ color: '#0dbf7e'}}>
                            {strings['pt-br']['onboardingTermsOfUsageDeclarationLabel']}
                        </Text>
                    </TouchableOpacity>
                    <Text>
                        {strings['pt-br']['onboardingSecondPartDeclarationLabel']}
                    </Text>
                    <TouchableOpacity onPress={e=> {props.openLinks('https://www.reflow.com.br/politicas-de-privacidade')}}>
                        <Text style={{ color: '#0dbf7e'}}>
                            {strings['pt-br']['onboardingPrivacyDeclarationLabel']}
                        </Text>
                    </TouchableOpacity>
                    <Text>
                        {strings['pt-br']['onboardingThirdPartDeclarationLabel']}
                    </Text>
                </Styled.OnboardingFormDeclarationLabel>
                <Styled.OnboardingFormBottomButtonsContainer> 
                    <Styled.OnboardingFormContinueButton disabled={continueButtonDisabled()} onPress={e=> props.setStep(1)}>
                        <Text>
                            {strings['pt-br']['onboardingCOntinueButtonLabel']}
                        </Text>
                    </Styled.OnboardingFormContinueButton>
                </Styled.OnboardingFormBottomButtonsContainer>
            </Styled.OnboardingFormFormContainer>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <Styled.OnboardingFormFormContainer showForm={props.showForm}>
                <Styled.OnboardingFormLabel>{strings['pt-br']['onboardingNameAndLastNameLabel']}<Styled.OnboardingFormRequiredLabel>*</Styled.OnboardingFormRequiredLabel></Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput
                    autoComplete={'whathever'} 
                    error={props.errors.hasOwnProperty('name')} 
                    type='text' 
                    value={props.name} 
                    onChange={e=> {
                        props.onValidate('name', e.target.value)
                        props.setName(e.target.value)
                    }} 
                    onBlur={e => {props.onValidate('name', e.target.value)}}
                />
                <Styled.OnboardingFormError>{props.errors.hasOwnProperty('name') ? props.errors['name'] : ''}</Styled.OnboardingFormError>
                <Styled.OnboardingFormLabel>{strings['pt-br']['onboardingPhoneLabel']}<Styled.OnboardingFormRequiredLabel>*</Styled.OnboardingFormRequiredLabel></Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput 
                    autoComplete={'whathever'} 
                    error={props.errors.hasOwnProperty('phone')} 
                    type='text' 
                    value={numberMasker(props.phone, props.getPhoneNumberMask(props.phone))} 
                    onChange={e=> {
                        props.onValidate('phone', e.target.value)
                        props.setPhone(e.target.value)
                    }}
                    onBlur={e => {props.onValidate('phone', e.target.value)}}
                />
                <Styled.OnboardingFormError>
                    {props.errors.hasOwnProperty('phone') ? props.errors['phone'] : ''}
                </Styled.OnboardingFormError>
                <Styled.OnboardingFormLabel>
                    {strings['pt-br']['onboardingEmailLabel']}
                    <Styled.OnboardingFormRequiredLabel>*</Styled.OnboardingFormRequiredLabel>
                </Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput 
                    error={props.errors.hasOwnProperty('email')} 
                    type='text' 
                    value={props.email} 
                    onChange={e=> {
                        props.onValidate('email', e.target.value)
                        props.setEmail(e.target.value)
                    }}
                    onBlur={e => {props.onValidate('email', e.target.value)}}
                />
                <Styled.OnboardingFormError>
                    {props.errors.hasOwnProperty('email') ? props.errors['email'] : ''}
                </Styled.OnboardingFormError>
                <Styled.OnboardingFormLabel>
                    {strings['pt-br']['onboardingConfirmEmailLabel']}
                    <Styled.OnboardingFormRequiredLabel>*</Styled.OnboardingFormRequiredLabel>
                </Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput 
                    autoComplete={'whathever'} 
                    error={props.errors.hasOwnProperty('confirmEmail')} 
                    type='text' 
                    value={props.confirmEmail} 
                    onChange={e=> {
                        props.onValidate('confirmEmail', e.target.value)
                        props.setConfirmEmail(e.target.value)
                    }}
                    onBlur={e => {props.onValidate('confirmEmail', e.target.value)}}
                />
                <Styled.OnboardingFormError>
                    {props.errors.hasOwnProperty('confirmEmail') ? props.errors['confirmEmail'] : ''}
                </Styled.OnboardingFormError>
                <Styled.OnboardingFormLabel>
                    {strings['pt-br']['onboardingCompanyNameLabel']}
                </Styled.OnboardingFormLabel>
                <Styled.OnboardingFormInput 
                type='text' 
                value={props.companyName} 
                onChange={e=> {props.setCompanyName(e.target.value)}}
                />
                <Styled.OnboardingFormNonRequiredFieldMessage>
                    {strings['pt-br']['onboardingNoCompanyNameMessage']}
                </Styled.OnboardingFormNonRequiredFieldMessage>
                <Styled.OnboardingFormDeclarationLabel>
                    <Styled.OnboardingFormDeclarationInput 
                    type="checkbox" 
                    checked={props.declarationChecked} 
                    onChange={e => props.setDeclarationChecked(!props.declarationChecked)}
                    />
                    &nbsp;{strings['pt-br']['onboardingFirstPartDeclarationLabel']}
                    <a href="https://www.reflow.com.br/termo-de-uso" style={{ color: '#0dbf7e'}} target="_blank">
                        {strings['pt-br']['onboardingTermsOfUsageDeclarationLabel']}
                    </a>{strings['pt-br']['onboardingSecondPartDeclarationLabel']}
                    <a href="https://www.reflow.com.br/politicas-de-privacidade" style={{ color: '#0dbf7e'}} target="_blank">
                        {strings['pt-br']['onboardingPrivacyDeclarationLabel']}
                    </a>{strings['pt-br']['onboardingThirdPartDeclarationLabel']}
                </Styled.OnboardingFormDeclarationLabel>
                <Styled.OnboardingFormBottomButtonsContainer> 
                    <Styled.OnboardingFormGoBackButton 
                    onClick={e=> props.redirectToLogin()}
                    >
                        {strings['pt-br']['onboardingLoginButtonLabel']}
                    </Styled.OnboardingFormGoBackButton>
                    <Styled.OnboardingFormContinueButton 
                    disabled={continueButtonDisabled()} 
                    onClick={e=> props.setStep(1)}
                    >
                        {strings['pt-br']['onboardingCOntinueButtonLabel']}
                    </Styled.OnboardingFormContinueButton>
                </Styled.OnboardingFormBottomButtonsContainer>
            </Styled.OnboardingFormFormContainer>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FirstStepForm