import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.label`
    margin-bottom: 20px;
    margin-top: 15px;
    font-size: 13px;
    user-select: none;
`
:
styled(Text)``