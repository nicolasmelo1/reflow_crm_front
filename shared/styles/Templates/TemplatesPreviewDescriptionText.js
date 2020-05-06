import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    white-space: pre-wrap;
    margin: 0
`
:
styled(Text)``