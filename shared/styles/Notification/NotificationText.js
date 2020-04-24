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
    margin: 0;
    padding: 5px;
    color: ${props => props.isVariable ? '#0dbf7e' : '#444'};
    font-weight: ${props => props.isVariable ? 'bold' : 'normal'};
`