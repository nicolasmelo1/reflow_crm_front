import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    width: 100%; 
    text-align: center;
    margin: 0 5px 1rem 5px;
`
:
styled(Text)``