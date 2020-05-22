import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    color: #0dbf7e
`
:
styled(Text)`
    color: #0dbf7e;
    font-size: 24px;
    font-weight: bold;
`