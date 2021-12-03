import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.small`
    margin: 0;
    color: ${props => props.isDependencyLabel ? '#0dbf7e': '#20253F'}
`
:
styled(Text)`
    margin: 0;
    font-size: 12px;
    color: ${props => props.isDependencyLabel ? '#0dbf7e': '#20253F'}
`