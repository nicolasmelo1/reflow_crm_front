import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    color: ${props => props.isSelected ? '#0dbf7e !important' : '#bfbfbf !important'};
    width: 100%;
    border: 0;
    background-color: transparent;
    text-align: left;
    
    &:hover {
        color: #0dbf7e !important;
    }
`
:
styled(TouchableOpacity)``