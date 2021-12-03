import React from 'react'
import styled from 'styled-components'
import NativePicker from '../../Utils/NativePicker'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'

// ------------------------------------------------------------------------------------------
export const NotificationConfigurationFormContainer = process.env['APP'] === 'web' ? 
styled.div`
    margin: 0 10px;
    background-color: #fff;
    padding: 5px 0;
`
:
styled(View)`
    background-color: #f2f2f2;
    border-bottom-color: #20253F;
    border-bottom-width: 1px;
    padding: 5px 0;
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationFormCheckboxesContainer = process.env['APP'] === 'web' ? 
styled.label`
    background-color: #fff;
    padding: 5px;
    border-radius: 4px;
    user-select: none;
`
:
styled(View)`
    flex-direction: row;
    flex-wrap: wrap
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationFormCheckboxText = process.env['APP'] === 'web' ? 
styled.p`
    display: inline;
    margin: 0;
    font-weight: bold;
`
:
styled(Text)`
    align-self: center
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationFormDaysDiffSelect = process.env['APP'] === 'web' ?
styled.div``
:
styled(NativePicker)`
    background-color: white;
    border: 1px solid #0dbf7e;
    border-radius: 4px;
    padding: 5px;
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationFormErrors = process.env['APP'] === 'web' ?
styled.small`
    color: red
`
:
styled(Text)`
    font-size: 8px;
    color: red;
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationFormFieldLabel = process.env['APP'] === 'web' ? 
styled.label`
    color: ${props => props.isVariable ? '#f2f2f2': '#20253F'};
    display: block;
    margin: 0;
    font-weight: bold;
    user-select: none;
`
:
styled(Text)`
    color: ${props => props.isVariable ? '#f2f2f2': '#20253F'};
    font-weight: bold;
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationFormFieldLabelRequired = process.env['APP'] === 'web' ? 
styled.p`
    display: inline;
    color: red;
`
: 
styled(Text)`
    color: red;
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationFormFieldInput = process.env['APP'] === 'web' ? 
styled.input`
    border: 0;
    background-color: white !important;
    color: #20253F;
    border: 2px solid ${props=> props.errors ? 'red': '#f2f2f2'};
    display: block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    background-clip: padding-box;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;


    &:focus {
        color: #20253F;
        background-color: white;
        border: 2px solid #20253F;
        box-shadow: none;
        outline: 0;
    }
`
:
styled(TextInput)`
    background-color: white !important;
    border-radius: 4px;
    padding: 5px;
    min-height: 30px;
    color: #20253F;
    border: 1px solid #f2f2f2;
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationFormFieldContainer = process.env['APP'] === 'web' ? 
styled.div`
    margin: ${props => props.isVariable ? '0 0 5px 0' : '0 10px 5px 10px'};
`
:
styled(View)`
    margin: ${props => props.isVariable ? '0 0 5px 0' : '0 10px 5px 10px'};
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationFormSelectContainer = process.env['APP'] === 'web' ? 
styled(React.forwardRef(({isOpen, errors, ...rest}, ref) => <div {...rest} ref={ref}/>))`
    background-color: white;
    color: #20253F;
    border: 2px solid ${props=>props.isOpen ? '#20253F': props.errors ? 'red': '#f2f2f2'};
    caret-color: #20253F;
    border-radius: .25rem;
    outline: none !important
`
:
styled(React.forwardRef(({errors, ...rest}, ref) => <View {...rest} ref={ref}/>))`
    background-color: white;
    border: 1px solid ${props=> props.errors ? 'red': '#f2f2f2'};
    border-radius: 4px;
    min-height: 30px;
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationFormVariableContainer = process.env['APP'] === 'web' ?
styled.div`
    background-color: #20253F;
    padding: 10px;
`
:
styled(View)`
    background-color: #20253F;
    padding: 10px;
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationFormSaveButton = process.env['APP'] === 'web' ? 
styled.button`
    width: 100%;
    padding: 5px;
    color: #f2f2f2;
    border: 1px solid #20253F;
    margin: 5px 0;
    border-radius: 20px;
    background-color: #20253F;

    &:hover {
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
    width: 100%;
    padding: 5px;
    color: #f2f2f2;
    border: 1px solid #20253F;
    margin: 5px 0;
    border-radius: 20px;
    background-color: #20253F;
    align-items: center;
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationFormForCompanyExplanation = process.env['APP'] === 'web' ?
styled.p`
    margin: 0;
    font-size: 12px;
    color: #bfbfbf;
`
:
styled(Text)`
    margin: 0;
    font-size: 12px;
    color: #989898;
    margin-bottom: 10px;
`
// ------------------------------------------------------------------------------------------
