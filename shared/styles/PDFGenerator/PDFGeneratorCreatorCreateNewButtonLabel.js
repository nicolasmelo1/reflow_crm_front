import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.span``
:
styled(Text)`
    font-size: 37px;
    color: #fff;
    text-align: center;
    height: 100%;
    width: 100%
`