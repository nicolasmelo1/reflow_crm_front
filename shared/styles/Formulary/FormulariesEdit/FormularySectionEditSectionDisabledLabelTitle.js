import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    color: ${props => props.isConditional ? '#f2f2f2' : '#20253F'};
    padding: 0 10px;
`
:
styled(Text)``