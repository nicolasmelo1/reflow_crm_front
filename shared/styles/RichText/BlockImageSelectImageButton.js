import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.label`
    background-color: #0dbf7e;
    color: #17242D;
    border-radius: 5px;
    margin: 0;
    padding: 0 10px;
`
:
styled(Text)``