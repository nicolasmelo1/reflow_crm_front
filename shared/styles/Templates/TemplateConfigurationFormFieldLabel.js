import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.label`
    color: ${props => props.isVariable ? '#f2f2f2': '#20253F'};
    display: block;
    margin: 0;
    font-weight: bold;
    user-select: none;
`
:
styled(Text)`
    color: ${props => props.isVariable ? '#f2f2f2': '#20253F'};
    font-weight: bold;
`
