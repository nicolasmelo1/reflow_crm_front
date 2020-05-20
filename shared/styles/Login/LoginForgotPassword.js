import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.small`
    color: #0dbf7e;
    min-height: 20px;
    align-self: flex-start;
    margin-bottom: 20px;
    user-select: none;
    cursor: pointer;
`
:
styled(Text)``