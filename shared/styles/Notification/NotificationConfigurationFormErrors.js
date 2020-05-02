import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.small`
    color: red
`
:
styled(Text)`
    font-size: 8px;
    color: red;
`