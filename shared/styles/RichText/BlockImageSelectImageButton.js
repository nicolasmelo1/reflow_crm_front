import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.label`
    background-color: #0dbf7e;
    color: #20253F;
    border-radius: 5px;
    margin: 0;
    padding: 0 10px;
`
:
styled(Text)`
    background-color: #0dbf7e;
    padding: 10px;
    border-radius: 5px;
`