import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h6`
    margin: 0;
    font-weight: bold
`
:
styled(Text)`
    margin-bottom: 10px;
    font-weight: bold
`