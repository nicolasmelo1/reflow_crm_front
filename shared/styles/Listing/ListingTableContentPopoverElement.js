import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    ${props=> props.hasBorderBottom ? 'border-bottom: 1px solid #bfbfbf;' : ''}
    padding: 0;
    margin: 5px
`
:
styled(Text)``