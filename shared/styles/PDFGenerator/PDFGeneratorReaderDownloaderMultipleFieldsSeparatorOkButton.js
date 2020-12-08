import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: #0dbf7e;
    border: 0;
    border-radius: 5px;
    color: #17242D;

    &:hover {
        background-color: #17242D;
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)``