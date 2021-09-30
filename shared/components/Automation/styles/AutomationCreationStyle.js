import React from 'react'
import styled from 'styled-components'
import { View, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const AutomationCreationGoBackButton = process.env['APP'] === 'web' ?
styled.button`
    display: flex;
    flex-direction: row;
    align-items: center;
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

export const AutomationCreationGoBackButtonLabel = process.env['APP'] === 'web' ?
styled.p`
    color: #172424D;
    margin-bottom: 0;
    margin-left: 5px;
`
:
styled(Text)`
    color: #172424D;
    margin: 0;
`

export const AutomationCreationGoBackButtonIcon = styled(FontAwesomeIcon)`
    color: #172424D;
`

export const AutomationCreationContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc(var(--app-width) - 20px);
    height: calc(var(--app-height) - 42px);
`
:
styled(View)``

export const AutomationCreationIfThisThanThatContainer = process.env['APP'] === 'web' ?
styled.div`
    border-radius: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 50px;
    background-color: #17242D;
    width: 510px;
    font-size: 40px;
    font-weight: bold;
    color: #fff;
`
:
styled(View)``

export const AutomationCreationIfThisThanThatLineBetween = process.env['APP'] === 'web' ?
styled.div`
    height: 60px;
    width: 4px;
    background-color: #bfbfbf;
`
:
styled(View)``

export const AutomationCreationIfThisThanThatButton = process.env['APP'] === 'web' ?
styled.button`
    border-radius: 20px;
    display: flex;
    border: 0;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 30px;
    background-color: #fff;
    font-size: 20px;
    font-weight: bold;
    color: #17242D;
`
:
styled(TouchableOpacity)``