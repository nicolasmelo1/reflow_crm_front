import React from 'react'
import styled from 'styled-components'
import { Text, View, TextInput, Switch, TouchableOpacity } from 'react-native'

// ------------------------------------------------------------------------------------------
export const OnboardingFormLabel = process.env['APP'] === 'web' ?
styled.label`
    display: block;
    font-weight: bold;
    margin: 0 0 5px 0;
    align-self: flex-start;

    &:not(:first-child) {
        margin-top: 10px
    }
`
:
styled(Text)`
    font-weight: bold;
    margin: 10px 0 5px 0;
    align-self: flex-start;
`
// ------------------------------------------------------------------------------------------
export const OnboardingFormRequiredLabel = process.env['APP'] === 'web' ?
styled.span`
    color: red;
    display: inline
`
:
styled(Text)`
    color: red;
`
// ------------------------------------------------------------------------------------------
export const OnboardingFormNonRequiredFieldMessage = process.env['APP'] === 'web' ?
styled.small`
    align-self: flex-start;
    color: #bfbfbf
`
:
styled(Text)`
    font-size: 13px;
    align-self: flex-start;
    color: #bfbfbf
`
// ------------------------------------------------------------------------------------------
export const OnboardingFormInput = process.env['APP'] === 'web' ? 
styled.input`
    display: block;
    width: 100%; 
    border-radius: 5px;
    color: #20253F;
    border: 2px solid ${props => props.error ? 'red': '#f2f2f2'};
    padding: .375rem .75rem;
    
    &:focus {
        color: #20253F;
        border: 2px solid ${props => props.error ? 'red': '#0dbf7e'};
        box-shadow: none;
        outline: 0;
    }
`
:
styled(TextInput)`
    width: 100%; 
    border-radius: 5px;
    color: #20253F;
    border: 2px solid ${props => props.error ? 'red': props.isFocused ? '#0dbf7e' : '#f2f2f2'};
    padding: 10px;
`
// ------------------------------------------------------------------------------------------
export const OnboardingFormError = process.env['APP'] === 'web' ?
styled.small`
    color: red;
    align-self: flex-start;
    min-height: 20px;
`
:
styled(Text)`
    color: red;
    align-self: flex-start;
    min-height: 20px;
`
// ------------------------------------------------------------------------------------------
export const OnboardingFormFormContainer = process.env['APP'] === 'web' ?
styled.div`
    padding: 20px;
    display: flex;
    background-color: #fff;
    box-shadow: 4px 4px 12px rgb(56 66 95 / 0.08);
    border-radius: 20px;
    align-items: center;
    flex-direction: column;
    opacity: ${props => props.showForm ? '1': '0'};
    transition: opacity 1s ease-in-out; 
    margin-top: 80px;
    max-height: calc(var(--app-height) - 120px);
    overscroll-behavior: none;
    overflow: auto;

    scrollbar-color: #bfbfbf transparent;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 5px;
    }

    &::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 8px;
        height: 8px;
        background-color: transparent;
    }
`
:
styled(ScrollView)`
    border-radius: 20px;
    padding: 0 20px 0 20px;
    width: 100%;
    height: 95%;
    flex-direction: column;
`
// ------------------------------------------------------------------------------------------
export const OnboardingSpreadsheetUploaderLoader = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc(var(--app-width) / 2);
    height: calc(var(--app-height) / 2);
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const OnboardingFormDeclarationInput = process.env['APP'] === 'web' ?
styled.input`
`
:
styled(Switch)`
    margin-right: 10px;
    margin-bottom: 10px;
    margin-top: 10px
`
// ------------------------------------------------------------------------------------------
export const OnboardingFormDeclarationLabel = process.env['APP'] === 'web' ?
styled.label`
    margin-bottom: 20px;
    margin-top: 15px;
    font-size: 13px;
    user-select: none;
`
:
styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 15px;
    font-size: 13px;
`
// ------------------------------------------------------------------------------------------
export const OnboardingFormContinueButton = process.env['APP'] === 'web' ?
styled.button`
    width: 150px;
    align-self: flex-end;
    background-color: ${props => props.disabled ? '#f2f2f2' : '#0dbf7e'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    border-radius: 20px;
    border: 0;
    padding: 5px;
`
:
styled(TouchableOpacity)`
    border-radius: 20px;
    margin: 0;
    padding: 10px;
    align-items: center;
    background-color: ${props => props.disabled ? '#f2f2f2' : '#0dbf7e'};
`
// ------------------------------------------------------------------------------------------
export const OnboardingFormGoBackButton = process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    color: #0dbf7e;
    border: 0;
    align-self: center;
    border-radius: 20px;
    margin: 0 20px 0 0;
`
:
styled(TouchableOpacity)`
    background-color: transparent;
    border: 1px solid #0dbf7e;
    border-radius: 20px;
    padding: 10px;
`
// ------------------------------------------------------------------------------------------
export const OnboardingFormBottomButtonsContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row; 
    justify-content: space-between;
    width: 100%
`
:
styled(View)`
    width: 100%;
    direction: rtl;
    flex-direction: row; 
    justify-content: space-between;
`
// ------------------------------------------------------------------------------------------
export const OnboardingFormSubmitButton = process.env['APP'] === 'web' ?
styled.button`
    width: 150px;
    background-color: ${props => props.disabled ? '#f2f2f2' : '#0dbf7e'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    border-radius: 20px;
    border: 0;
    padding: 5px;
    margin: 0 0 0 20px;
`
:
styled(TouchableOpacity)`
    background-color: ${props => props.disabled ? '#f2f2f2' : '#0dbf7e'};
    border-radius: 20px;
    padding: 10px;
`
// ------------------------------------------------------------------------------------------
export const OnboardingFormVisualizePasswordLabel = process.env['APP'] === 'web' ?
styled.label`
    user-select: none;
    font-size: 13px;;
    margin-bottom: 20px;
`
:
styled(TouchableOpacity)`
    align-items: center;
    flex-direction: row;
    margin-bottom: 20px;
`
// ------------------------------------------------------------------------------------------
