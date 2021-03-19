import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    width: 100%; 
    text-align: center;
    font-size: 30px;
    color: #0dbf7e;
    margin-bottom: 0;
    font-weight: bold
`
:
styled(Text)``