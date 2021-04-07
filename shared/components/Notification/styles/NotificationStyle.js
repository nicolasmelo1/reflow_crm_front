import React from 'react'
import styled from 'styled-components'
import { View, Text, TouchableOpacity } from 'react-native'

// ------------------------------------------------------------------------------------------
export const NotificationHeader = process.env['APP'] === 'web' ?
styled.div``
:
styled(View)`
    flex-direction: row;
    align-items: center;
    direction: ${props => props.isEditing ? 'rtl': 'inherit'};
    width: 100%;
    border-bottom-width: 1px;
    border-bottom-color: #f2f2f2; 
    padding: 10px;
`
// ------------------------------------------------------------------------------------------
export const NotificationButton = process.env['APP'] === 'web' ? 
styled.button`
    float: right;
    border: none;
    background-color: transparent;
    color: #17242D;
    &:hover {
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
    position:absolute;
    font-size: 30px;
    border-radius: 4px;
    padding: 12px;
    right: 0
`
// ------------------------------------------------------------------------------------------
export const NotificationTitle = process.env['APP'] === 'web' ? 
styled.h2`
    color: #0dbf7e;
    border-bottom: 1px solid #bfbfbf;
` 
:
styled(Text)`
    color: #0dbf7e;
    font-family: Roboto-Bold;
    font-size: 30px;
`
// ------------------------------------------------------------------------------------------