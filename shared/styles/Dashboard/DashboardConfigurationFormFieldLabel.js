import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.label`
    color: #20253F;
    display: block;
    margin: 0px;
    font-weight: bold;
    user-select: none;
`
:
styled(Text)`
    font-weight: bold;
`