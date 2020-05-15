import React from 'react'
import styled, { keyframes } from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: ${props => props.variant === 'error' ? '#f8d7da' : '#d4edda' };
    padding: 10px;
    margin-bottom: 5px;
`
:
styled(View)`
    background-color: ${props => props.variant === 'error' ? '#f8d7da' : '#d4edda' };
    padding: 10px;               
`