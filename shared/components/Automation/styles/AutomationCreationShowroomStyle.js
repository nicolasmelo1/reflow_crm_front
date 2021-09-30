import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import styled from 'styled-components'

export const AutomationCreationShowroomContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 50px;
    width: 100%;
    height: 100%;
`
:
styled(View)``

export const AutomationCreationShowroomSearchBar = process.env['APP'] === 'web' ? 
styled.input`
    width: 70%;
    font-size: 20px;
    font-weight: bold;
    padding: 20px;
    border: 2px solid #17242D;
    border-radius: 20px;
    margin-bottom: 10px;
    outline: none;

    &:focus {
        border: 2px solid #0dbf7e;
    }
`
:
styled(TextInput)`
`

export const AutomationCreationShowroomAppButton = process.env['APP'] === 'web' ?
styled.button`
    height: 150px;
    width: 150px;
    border: 0;
    background-color: ${props=> props.appColor};
    border-radius: 20px;
    color: #fff
`
:
styled(TouchableOpacity)``

export const AutomationCreationShowroomAppButtonLabel = process.env['APP'] === 'web' ?
styled.p`
    margin: 0;
    font-size: bold;
`
:
styled(Text)``