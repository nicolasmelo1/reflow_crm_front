import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    margin: 0px;
    font-size: 20px;
    color: ${props => props.isCollapsed || props.isNullId ? '#bfbfbf': '#20253F'};
    font-weight: ${props => props.isCollapsed ? 'normal' : 'bold'};
    width: ${props => props.isCollapsed ? '40px' : '100%'}; 
    height: ${props => props.isCollapsed ? '40px' : '100%'}; 
    text-align: ${props => props.isCollapsed ? 'right': 'left'}; 
    transform: ${props => props.isCollapsed ? 'rotate(-90deg)': 'none'};
    direction: ${props => props.isCollapsed ? 'rtl': 'unset'};
    display: flex;
    white-space: ${props => props.isCollapsed ? 'nowrap' : 'wrap'};
    align-items: center
`
:
styled(Text)``