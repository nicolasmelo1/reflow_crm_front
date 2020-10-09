import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: white;
    border: 0;
    color: red;
    border-radius: 0;
    width: 40px;

    &:hover {
        background-color: white;
        border: 0;
        color: red;
    }
    &:active {
        background-color: white !important;
        border: 0;
        color: red;
    }
`
:
styled(TouchableOpacity)`
    width: 35px;
    border-radius: 5px;
    margin-bottom: 10px;
    margin-left: 5px; 
    background-color: red;
    padding: 10px;
`