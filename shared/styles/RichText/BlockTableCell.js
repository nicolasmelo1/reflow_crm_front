import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.td`
    border: 1px solid #000;
    padding: 10px;
    position: relative; 
    width: ${props => props.width}%
`
:
styled(View)``