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
    position:absolute;
    font-size: 30px;
    border-radius: 4px;
    padding: 12px;
    right: 0
`