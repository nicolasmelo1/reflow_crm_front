import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    display: flex;
    flex-direction: row; 
    align-items: center;
    color: ${props => props.isSelected ? '#0dbf7e' : '#6a7074'};
    min-width: 200px;
    background-color: transparent;
    border: 0;

    &:hover {
        font-weight: bold;
        color: #17242D;
    }
`
:
styled(TouchableOpacity)``