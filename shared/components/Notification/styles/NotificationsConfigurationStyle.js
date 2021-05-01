import React from 'react'
import styled from 'styled-components'
import { Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

// ------------------------------------------------------------------------------------------
export const NotificationConfigurationContainer = process.env['APP'] === 'web' ?
styled.div`
    overflow-y: auto;
    height: calc(var(--app-height) - var(--app-navbar-height) - 45px);

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
styled(SafeAreaView)``
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationAddNewCardIcon = styled(FontAwesomeIcon)`
    color: #0dbf7e
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationAddNewCard = process.env['APP'] === 'web' ?
styled.div`
    border: 1px dashed #0dbf7e;
    padding: 5px;
    background-color: transparent;
    margin-top: 5px;
    min-height: 40px;
    border-radius: 4px;
    cursor: pointer;
`
:
styled(TouchableOpacity)`
    align-items: center;
    padding: 10px;
    min-height: 50px;
    border-bottom-width: 1px;
    border-bottom-color: #0dbf7e;
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationAddNewCardText = process.env['APP'] === 'web' ?
styled.p`
    margin: 0;
    color: #0dbf7e;
`
:
styled(Text)`
    margin: 0;
    color: #0dbf7e;
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationGoBackButton = process.env['APP'] === 'web' ?
styled.button`
    color: #17242D;
    font-size: 20px;
    background-color: transparent;
    border: 0;
    
    &:hover {
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
    align-self: center;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
`
// ------------------------------------------------------------------------------------------
