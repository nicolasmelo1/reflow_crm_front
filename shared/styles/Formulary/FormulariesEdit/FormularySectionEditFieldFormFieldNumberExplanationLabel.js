import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    font-weight: bold;
    margin-bottom: 5px;
`
:
styled(Text)``