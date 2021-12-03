import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    color: #0dbf7e;
    border: 0;
    font-size: 25px;
    margin-bottom: 10px;

    &:hover {
        color: #20253F;
        background-color: #bfbfbf50;
        border-radius: 5px;
    }
`
:
styled(TouchableOpacity)``