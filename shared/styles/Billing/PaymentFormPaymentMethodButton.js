import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    width: 100%;
    text-align: center;
    background-color: transparent;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    font-weight: bold;
    color: ${props => props.isSelected ? '#0dbf7e': '#17242D'};
    border-bottom: ${props => props.isSelected ? '2px solid #0dbf7e': '0'};
    padding: 10px;
`
:
styled(TouchableOpacity)``