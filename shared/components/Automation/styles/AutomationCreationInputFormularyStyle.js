import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
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
    padding-top: 30px;
    width: 50%
`
:
styled(Text)``