import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border-radius: 5px;
    margin-bottom: 5px; 
    padding: 10px;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 0;
    background-color: transparent;
    color: ${props => props.isSelected ? '#0dbf7e' : '#6a7074'};
    cursor: pointer;

    &:hover {
        color: ${props => props.isSelected ? 'red' : '#0dbf7e'};
    }
`
:
styled(TouchableOpacity)``