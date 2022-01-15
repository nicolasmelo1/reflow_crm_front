import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    font-weight: bold;
    width: calc((100% / 2) - 70px);
    margin: 0 0 0 10px;
    text-align: right
`
:
styled(Text)``