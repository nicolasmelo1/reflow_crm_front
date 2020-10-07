import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    color: ${props => props.isEmpty ? '#bfbfbf': '#0dbf7e'};
    margin: 0;
`
:
styled(Text)``