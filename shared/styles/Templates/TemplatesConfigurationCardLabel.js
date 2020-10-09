import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h5`
    color: ${props => props.isEmpty ? '#bfbfbf': '#0dbf7e'};
    margin: 0;
    font-weight: bold;
`
:
styled(Text)`
    color: ${props => props.isEmpty ? '#bfbfbf': '#0dbf7e'};
    font-size: 24px;
    margin: 0;
`