import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h3`
    color: #0dbf7e;
`
:
styled(Text)`
    font-size: 24px;
    color: #0dbf7e;
`