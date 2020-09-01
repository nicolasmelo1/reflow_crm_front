import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    margin: 0;
    color: #17242D;
    width: 100%;
    text-align: center;
`
:
styled(Text)`
    color: #17242D;
`