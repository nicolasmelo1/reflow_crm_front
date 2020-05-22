import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.small`
    align-self: flex-start;
    color: #bfbfbf
`
:
styled(Text)`
    font-size: 13px;
    align-self: flex-start;
    color: #bfbfbf
`