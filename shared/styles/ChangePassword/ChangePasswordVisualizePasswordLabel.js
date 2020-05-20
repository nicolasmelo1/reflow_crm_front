import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.label`
    user-select: none;
    font-size: 13px;;
    margin-bottom: 20px;
`
:
styled(Text)``