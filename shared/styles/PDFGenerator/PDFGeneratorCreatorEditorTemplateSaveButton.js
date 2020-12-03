import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 1px solid #0dbf7e;
    background-color: #0dbf7e;
    padding: 5px 15px;
    border-radius: 5px;
    margin-right: 5px;
    color: #17242D;

    &:hover {
        color: #0dbf7e;
        border: 1px solid #17242D;
        background-color: #17242D;
    }
`
:
styled(TouchableOpacity)``