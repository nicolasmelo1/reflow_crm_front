import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    font-style: italic;
    color: ${props => props.isItalic ? '#0dbf7e': '#000'};
    background-color: transparent;
    border: none;
    border-radius: 2px;
    padding: 0 5px;
    width: 30px;
    text-align: center;

    &:hover {
        background-color: #0dbf7e20
    }
`
:
styled(Text)``