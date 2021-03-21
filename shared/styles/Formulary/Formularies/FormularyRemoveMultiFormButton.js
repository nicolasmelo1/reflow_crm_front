import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.button`
    float: right;
    background-color: transparet;
    color: red;
    border: 0;

    &:hover {
        color: #17242D;
    }
`
:
styled(TouchableOpacity)``