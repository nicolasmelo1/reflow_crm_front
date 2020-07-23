import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.label`
    margin-top: 10px;
    margin-bottom: 5px;
    font-weight: bold;
`
:
styled(Text)``