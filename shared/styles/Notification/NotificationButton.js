import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.button`
    float: right;
    border: none;
    background-color: transparent;
    color: #17242D;
    &:hover {
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
    width: 100%;
    background-color: #0dbf7e;
    padding: 10px;
    border-radius: 4px;
    justify-content: center;
    align-items: center
`