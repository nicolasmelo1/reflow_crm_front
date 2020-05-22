import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.small`
    color: red;
    align-self: flex-start;
    min-height: 20px;
`
:
styled(Text)`
    color: red;
    align-self: flex-start;
    min-height: 20px;
`