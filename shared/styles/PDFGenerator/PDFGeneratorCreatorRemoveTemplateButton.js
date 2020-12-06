import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    border-radius: 5px;
    color: red;

    &:hover {
        color: #fff;
        background-color: red;
    }
`
:
styled(TouchableOpacity)``