import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    margin: 10px 10px 0 10px;
    white-space: nowrap
`
:
styled(Text)``