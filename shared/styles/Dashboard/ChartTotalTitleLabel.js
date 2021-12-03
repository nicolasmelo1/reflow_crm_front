import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    white-space: normal;
    font-weight: bold;
    font-size: 12px;
    color: #20253F;
    margin-bottom: 15px;
`
:
styled(Text)`
    font-weight: bold;
    color: #20253F;
    font-size: 12px;
    margin-bottom: 15px;
`