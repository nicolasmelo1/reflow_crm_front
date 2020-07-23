import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    color: white;

    &:hover{
        border-radius: 5px;
        background-color: #fff;
        color: #17242D;
    }
`
:
styled(TouchableOpacity)``