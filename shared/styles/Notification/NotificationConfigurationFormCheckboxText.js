import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.p`
    display: inline;
    margin: 0;
    font-weight: bold;
`
:
styled(Text)`
    align-self: center
`