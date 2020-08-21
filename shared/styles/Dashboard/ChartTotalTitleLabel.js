import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    white-space: normal;
    font-weight: bold;
    font-size: 12px;
    color: #0dbf7e;
    margin-bottom: 15px;
`
:
styled(Text)`
    font-weight: bold;
    color: #17242D;
    font-size: 12px;
    margin-bottom: 15px;
`