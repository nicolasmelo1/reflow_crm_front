import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    padding: 0 5px;
    border: 0;
    border-radius: 2px;
    width: 30px;
    text-align: center;
    &:hover {
        background-color: #0dbf7e20
    }
`
:
styled(TouchableOpacity)``