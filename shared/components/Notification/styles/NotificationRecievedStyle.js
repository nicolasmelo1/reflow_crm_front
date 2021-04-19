import React from 'react'
import styled from 'styled-components'
import { Text, TouchableOpacity } from 'react-native'

// ------------------------------------------------------------------------------------------
export const NotificationText = process.env['APP'] === 'web' ? 
styled.span`
    margin: 0;
    color: ${props => props.isVariable ? '#0dbf7e' : 'initial'};
    font-weight: ${props => props.isVariable ? 'bold' : 'normal'};
`
:
styled(Text)`
    font-size: 15px;
    font-family: Roboto-Regular;
    color: ${props => props.isVariable ? '#0dbf7e' : '#17242D'};
    font-weight: ${props => props.isVariable ? 'bold' : 'normal'};
`
// ------------------------------------------------------------------------------------------
export const NotificationDate = process.env['APP'] === 'web' ? 
styled.small`
    color: #bfbfbf
`
:
styled(Text)`
    font-size: 14px;
    font-family: Roboto-Regular;
    color: #bfbfbf;
    font-size: 10px 
`
// ------------------------------------------------------------------------------------------
export const NotificationContainer = process.env['APP'] === 'web' ? 
styled.div`
    height: calc(100vh - 150px);
    overflow-y: auto;
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
    min-height: 250px;
    height: 93.4%;
`
// ------------------------------------------------------------------------------------------
export const NotificationCard = process.env['APP'] === 'web' ? 
styled.div`
    border: 1px solid #17242D;
    border-radius: 5px;
    margin-bottom: 10px; 
    padding: 5px;
    cursor: pointer;
    background-color: ${props => props.hasRead ? 'transparent': '#fff'}
`
:
styled(TouchableOpacity)`
    padding: 10px;
    border-bottom-width: 1px;
    border-bottom-color: #17242D;
    min-height: 50px;
    background-color: ${props => props.hasRead ? 'transparent': '#fff'}
`
// ------------------------------------------------------------------------------------------
