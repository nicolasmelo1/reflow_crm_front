import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ? 
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