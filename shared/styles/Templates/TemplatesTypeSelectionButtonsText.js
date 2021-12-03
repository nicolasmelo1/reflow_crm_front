import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    margin: 0;
    color: ${props => props.isSelected ? '#f2f2f2': '#20253F'};
`
:
styled(Text)`
    color: ${props => props.isSelected ? '#20253F': '#20253F'};
`