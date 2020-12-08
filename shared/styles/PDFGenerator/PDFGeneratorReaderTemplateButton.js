import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    color: #0dbf7e;
    padding: 0;
    margin: 0;
    display: block;
    width: 100%;
    text-align: left;

    &:hover {
        color: #17242D;
    }
`
:
styled(TouchableOpacity)``