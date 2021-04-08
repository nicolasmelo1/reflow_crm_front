import React from 'react'
import styled from 'styled-components'
import { TextInput, Text, Image, SafeAreaView, View } from 'react-native'

// ------------------------------------------------------------------------------------------
export const ChangePasswordInput = process.env['APP'] === 'web' ?
styled.input`
    display: block;
    width: 100%; 
    border-radius: 5px;
    color: #17242D;
    border: 2px solid ${props => props.error ? 'red': '#f2f2f2'};
    padding: .375rem .75rem;
    
    &:focus {
        color: #17242D;
        border: 2px solid ${props => props.error ? 'red': '#0dbf7e'};
        box-shadow: none;
        outline: 0;
    }
`
:
styled(TextInput)`
    width: 100%; 
    border-radius: 5px;
    color: #17242D;
    border: 2px solid ${props => props.error ? 'red': props.isFocused ? '#0dbf7e' : '#f2f2f2'};
    padding: 10px;
`
// ------------------------------------------------------------------------------------------
export const ChangePasswordLabel = process.env['APP'] === 'web' ?
styled.label`
    display: block;
    font-weight: bold;
    margin: 5px 0 10px 0;
    align-self: flex-start;
`
:
styled(Text)`
    font-weight: bold;
    margin: 10px 0 5px 0;
    align-self: flex-start;
`
// ------------------------------------------------------------------------------------------
export const ChangePasswordError = process.env['APP'] === 'web' ?
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
export const ChangePasswordLogo = process.env['APP'] === 'web' ?
styled.img`
    position: absolute;
    display: block;
    margin-bottom: 20px; 
    width: 30%;
    max-width: 200px;
    top: 10px;
`
:
styled(Image)`
    width: 50%;
    resize-mode: contain;
`
// ------------------------------------------------------------------------------------------
export const ChangePasswordContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: var(--app-height);
`
:
styled(SafeAreaView)`
    padding: 0;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-direction: column;
`
// ------------------------------------------------------------------------------------------
export const ChangePasswordFormContainer = process.env['APP'] === 'web' ?
styled.div`
    border-radius: 20px;
    padding: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
`
:
styled(View)`
    width: 70%;
    padding: 10px;
`
// ------------------------------------------------------------------------------------------
export const ChangePasswordSubmitButton = process.env['APP'] === 'web' ?
styled.button`
    width: 150px;
    background-color: ${props => props.disabled ? '#f2f2f2' : '#0dbf7e'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    border-radius: 20px;
    border: 0;
    padding: 5px;
`
:
styled(TouchableOpacity)`
    background-color: ${props => props.disabled ? '#f2f2f2' : '#0dbf7e'};
    border-radius: 20px;
    padding: 10px 30px;
`
// ------------------------------------------------------------------------------------------
export const ChangePasswordVisualizePasswordLabel = process.env['APP'] === 'web' ?
styled.label`
    user-select: none;
    font-size: 13px;;
    margin-bottom: 20px;
`
:
styled(TouchableOpacity)`
    align-self: center;
    align-items: center;
    flex-direction: row;
    margin-bottom: 20px;
`
// ------------------------------------------------------------------------------------------
export const ChangePasswordHeader = process.env['APP'] === 'web' ?
styled.div``
:
styled(View)`
    width: 100%;
    display: flex;
    direction: rtl;
    flex-direction: row;
    padding: 10px;
`
// ------------------------------------------------------------------------------------------
export const ChangePasswordGoBackButton = process.env['APP'] === 'web' ?
styled.button`
    color: #172424D;
    border: 0;
    margin: 10px 0;
    padding: 0;
    background-color: transparent
`
:
styled(TouchableOpacity)`
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
`
// ------------------------------------------------------------------------------------------