import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    font-weight: bold;
    color: ${props => props.isBold ? '#0dbf7e': '#000'};
    background-color: transparent;
    border: none;
    border-radius: 2px;
    padding: 0 5px;
    width: 30px;
    height: 30px;
    text-align: center;
    
    &:hover {
        background-color: #0dbf7e20
    }
`
:
styled(TouchableOpacity)`
    font-weight: bold;
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 2px;
    padding: 0 5px;
    width: 40px;
    text-align: center;
    height: 40px;
`