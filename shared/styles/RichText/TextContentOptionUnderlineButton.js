import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    color: ${props => props.isUnderline ? '#0dbf7e': '#000'};
    background-color: transparent;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    padding: 0 5px;
    border-bottom: 1px solid ${props => props.isUnderline ? '#0dbf7e' : '#000'};
    border-radius: 2px;
    width: 30px;
    height: 30px;
    text-align: center;

    &:hover {
        background-color: #0dbf7e20
    }
`
:
styled(TouchableOpacity)`
    background-color: transparent;
    border-top-width: 0;
    border-left-width: 0;
    border-right-width: 0;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.isUnderline ? '#0dbf7e' : '#000'};
    border-radius: 2px;
    height: 40px;
    width: 40px;
    text-align: center;
`