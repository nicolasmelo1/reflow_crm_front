import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    margin: 0 5px;
    color: #bfbfbf;
`
:
styled(Text)`
    font-size: 24px;
    color: #bfbfbf;
`