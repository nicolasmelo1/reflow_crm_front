import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    display: block; 
    width: 100%; 
    text-align: left;
    height: 50px;
    border-bottom: 1px solid #f2f2f2; 
    background-color: transparent;
    color: #17242D;
    border-left: 0; 
    border-top:0; 
    border-right: 0;

    &:hover {
        color: #0dbf7e !important
    }
`
:
styled(TouchableOpacity)``