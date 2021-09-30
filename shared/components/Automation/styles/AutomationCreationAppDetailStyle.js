import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import styled from 'styled-components'

export const AutomationCreationAppDetailContainer = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
`
:
styled(View)``


export const AutomationCreationAppDetailHeader = process.env['APP'] === 'web' ? 
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

export const AutomationCreationAppDetailHeaderAppTitle = process.env['APP'] === 'web' ? 
styled.p`
    font-size: 40px;
    font-weight: bold;
    margin: 0;
`
:
styled(Text)``

export const AutomationCreationAppDetailHeaderAppDescription = process.env['APP'] === 'web' ? 
styled.p`
    font-size: 15px;
    margin: 0;
`
:
styled(Text)``

export const AutomationCreationAppDetailTriggerOrActionButtonsContainer = process.env['APP'] === 'web' ? 
styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`
:
styled(View)``

export const AutomationCreationAppDetailTriggerOrActionButton = process.env['APP'] === 'web' ? 
styled.button`
    background-color: ${props => props.appColor};
    border-radius: 10px;
    border: 0;
    width: calc(var(--app-width)/4);
    min-width: 200px;
    height: 200px;
    padding: 20px;
    margin: 20px;
`
:
styled(TouchableOpacity)``