import React from 'react'
import styled from 'styled-components'
import { Text, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

// ------------------------------------------------------------------------------------------
export const NotificationConfigurationCard = process.env['APP'] === 'web' ?
styled.div`
    border: ${props => props.formIsOpen ? '#1px solid #0dbf7e' : '1px solid #17242D'};
    padding: 5px;
    background-color: ${props => props.formIsOpen ? '#0dbf7e' : 'transparent'};
    margin-top: 5px;
    min-height: 40px;
    border-radius: 4px;
    cursor: pointer;
`
:
styled(TouchableOpacity)`
    background-color: ${props => props.formIsOpen ? '#0dbf7e' : 'transparent'};
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.formIsOpen ? '#0dbf7e': '#17242D'};
    padding: 5px;
    min-height: 50px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationCardText = process.env['APP'] === 'web' ?
styled.h2`
    margin: 0;
    color: ${props => props.formIsOpen || props.isNew ? '#17242D' : '#0dbf7e'};
    user-select: none;
    justify-content: space-between;
    align-items: center;
    display: flex;
`
:
styled(Text)`
    margin: 0;
    font-size: 20px;
    max-width: 85%;
    color: ${props => props.formIsOpen || props.isNew ? '#17242D' : '#0dbf7e'};
`
// ------------------------------------------------------------------------------------------
export const NotificationConfigurationCardIcon = process.env['APP'] === 'web' ?
styled(FontAwesomeIcon)`
    font-size: 20px;
    margin: 0 10px;
    color: #17242D
`
:
styled(FontAwesomeIcon)`
    font-size: 20px;
    color: #17242D
`
// ------------------------------------------------------------------------------------------
