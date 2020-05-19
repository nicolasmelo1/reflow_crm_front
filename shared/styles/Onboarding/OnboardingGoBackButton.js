import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    color: #0dbf7e;
    border: 0;
    align-self: center;
    border-radius: 20px;
    margin: 0 20px 0 0;
`
:
styled(TouchableOpacity)``