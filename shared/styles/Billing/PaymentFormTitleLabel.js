import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    width: 100%;
    color: #0dbf7e;
    font-weight: bold;
    text-align: center;
`
:
styled(Text)``