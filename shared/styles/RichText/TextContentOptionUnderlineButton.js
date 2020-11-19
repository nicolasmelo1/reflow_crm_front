import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

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
    text-align: center;

    &:hover {
        background-color: #0dbf7e20
    }
`
:
styled(Text)``