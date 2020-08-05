import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    margin: 0;
    font-size: 12px;
    color: #bfbfbf;
`
:
styled(Text)`
    margin: 0;
    font-size: 12px;
    color: #989898;
    margin-bottom: 10px;
`