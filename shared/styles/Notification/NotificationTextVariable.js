import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.p`
    margin: 0;
    color: #0dbf7e
`
:
styled(Text)``