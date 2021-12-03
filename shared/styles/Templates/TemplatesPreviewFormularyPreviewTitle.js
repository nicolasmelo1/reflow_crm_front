import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    color: #20253F
`
:
styled(Text)`
    margin-top: 15px;
    color: #20253F;
    font-size: 24px;
    font-weight: bold;
`