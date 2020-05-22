import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    color: #17242D
`
:
styled(Text)`
    margin-top: 15px;
    color: #17242D;
    font-size: 24px;
    font-weight: bold;
`