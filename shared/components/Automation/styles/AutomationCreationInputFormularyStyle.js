import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import styled from 'styled-components'


export const AutomationCreationInputFormularyContainer = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
`
:
styled(View)``


export const AutomationCreationInputFormularyHeader = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    width: calc(100% + 20px);
    min-height: 300px;
    background-color: ${props => props.appColor};
`
:
styled(View)``


export const AutomationCreationInputFormularyHeaderAppName = process.env['APP'] === 'web' ? 
styled.p`
    font-size: 40px;
    font-weight: bold;
    margin: 0;
`
:
styled(Text)``


export const AutomationCreationInputFormularyHeaderTriggerOrActionName= process.env['APP'] === 'web' ? 
styled.p`
    font-size: 35px;
    margin: 0;
`
:
styled(Text)``

export const AutomationCreationInputFormularyHeaderDescription= process.env['APP'] === 'web' ? 
styled.p`
    font-size: 15px;
    margin: 0;
`
:
styled(Text)``

export const AutomationCreationInputFormularyFormContainer = process.env['APP'] === 'web' ? 
styled.div`
    width: 50%
`
:
styled(View)``

export const AutomationCreationInputFormularyMultiSectionAddButton = process.env['APP'] === 'web' ? 
styled.button`
    border: 0;
    background-color: #0dbf7e;
    border-radius: 5px;
    padding: 5px 0;
    width: 100%;
    margin-bottom: 10px;
    color: #20253F;

    &:hover {
        background-color: #20253F;
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)``


export const AutomationCreationInputFormularyMultiSectionContainer = process.env['APP'] === 'web' ? 
styled.div`
    border-radius: 5px;
    background-color: #f2f2f2;
    margin-left: -10px;
    margin-right: -10px;
    margin-bottom: 10px;
    padding: 10px;
`
:
styled(View)``

export const AutomationCreationInputFormularyMultiSectionHeader = process.env['APP'] === 'web' ? 
styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
`
:
styled(View)``

export const AutomationCreationInputFormularyMultiSectionTitle = process.env['APP'] === 'web' ? 
styled.h2`
    margin-top: 30px;
    text-align: center;
    font-weight: normal;
    letter-spacing: 0.5px;
    text-shadow: -1px -1px 0 #20253F, 1px -1px 0 #20253F, -1px 1px 0 #20253F, 1px 1px 0 #20253F;
    border-bottom: 1px solid #f2f2f2;
`
:
styled(Text)``

export const AutomationCreationInputFormularyMultiSectionHeaderDeleteButton = process.env['APP'] === 'web' ? 
styled.button`
    background-color: transparent;
    border: 0;
    border-radius: 5px;

    &:hover {
        background-color: #fff
    }
`
:
styled(TouchableOpacity)``

export const AutomationCreationInputFormularyMultiSectionHeaderDeleteButtonIcon = styled(FontAwesomeIcon)`
    color: red;
`

export const AutomationCreationInputFormularyFieldLabel = process.env['APP'] === 'web' ? 
styled.p`
    margin-bottom: 5px;
    font-weight: bold
`
:
styled(Text)``

export const AutomationCreationInputFormularyFieldTextInput = process.env['APP'] === 'web' ? 
styled.input`
    width: 100%;
    border: 2px solid #bfbfbf;
    border-radius: 5px;
    line-height: 1.5;
    font-size: 1rem;
    padding: 8px;
    height: 41px;
`
:
styled(TextInput)``


