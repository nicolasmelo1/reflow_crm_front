import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.label`
    display: block;
    font-weight: bold;
    margin: 5px 0 10px 0;
    align-self: flex-start;
`
:
styled(Text)``