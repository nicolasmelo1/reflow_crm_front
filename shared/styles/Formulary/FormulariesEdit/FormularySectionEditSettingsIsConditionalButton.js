import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.label`
    background-color: #20253F;
    color: #f2f2f2; 
    font-weight: bold; 
    border-radius: 10px; 
    padding: 5px; 
    margin: 0
`
:
styled(Text)``