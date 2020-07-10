import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: #17242D;
    border: 0;
    padding: 5px 5px;
    width: 100%;
    text-align: center;
    color: #fff;
    border-radius: .25rem;

    &:hover {
        background-color: #0dbf7e;
        border: 0;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 0;
    }
`
:
styled(TouchableOpacity)``