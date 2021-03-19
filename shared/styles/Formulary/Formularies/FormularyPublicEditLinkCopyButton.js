import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;

    &:hover {
        background-color: #fff;
        border-radius: 50%;
    }
`
:
styled(TouchableOpacity)``