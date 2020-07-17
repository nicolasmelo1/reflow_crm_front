import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    text-align: center;
    position: absolute;
    width: 100%;
    color: #0dbf7e;
    overflow: auto;
    white-space: nowrap;
`
:
styled(Text)`
    text-align: center;
    width: 100%;
    color: #0dbf7e;
    font-size: 24px;
`