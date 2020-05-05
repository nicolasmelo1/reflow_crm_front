import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    color: #f2f2f2;
    padding: 0;
    margin: 0;
`
:
styled(Text)``