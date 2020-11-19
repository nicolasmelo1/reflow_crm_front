import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    border-radius: 5px;

    &:hover {
        background-color: #0dbf7e20
    }
`
:
styled(TouchableOpacity)``