import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    border-radius: 5px;
    color: #0dbf7e;

    &:hover {
        color: #17242D;
        background-color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
    margin: 5px 10px;
`