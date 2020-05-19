import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.span`
    color: red;
    display: inline
`
:
styled(Text)`
    color: red;
`