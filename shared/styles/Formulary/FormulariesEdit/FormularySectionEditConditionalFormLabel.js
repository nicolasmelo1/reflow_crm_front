import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.label`
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 0;
    user-select: none;
`
:
styled(Text)``