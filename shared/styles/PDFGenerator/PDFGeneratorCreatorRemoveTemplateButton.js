import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    border-radius: 5px;
    color: red;

    &:hover {
        color: #fff;
        background-color: red;
    }
`
:
styled(TouchableOpacity)`
    align-items: center;
    justify-content: center;
    height: 70px;
    background-color: red;
    margin: 1px 0 0 0;
`