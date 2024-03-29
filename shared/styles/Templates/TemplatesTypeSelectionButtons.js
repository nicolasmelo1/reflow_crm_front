import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: ${props => props.isSelected ? '#0dbf7e': 'transparent'};
    padding: 10px 15px;
    display: block;
    border: 0;
    border-radius: 20px;
    margin: 10px 0;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.isSelected ? '#0dbf7e': '#fff'};
    }

    @media(max-width: 492px) {
        display: inline;
        overflow: hidden;
    }

    @media(min-width: 492px) {
        display: block;
    }
`
:
styled(TouchableOpacity)`
    background-color: ${props => props.isSelected ? '#0dbf7e': '#fff'};
    margin: 5px 5px;
    padding: 10px;
    border-radius: 20px;
`