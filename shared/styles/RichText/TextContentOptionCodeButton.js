import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    color: ${props => props.isCode ? '#0dbf7e': '#000'};
    background-color: transparent;
    padding: 0 5px;
    border: 0;
    border-radius: 2px;
    width: 30px;
    text-align: center;

    &:hover {
        background-color: #0dbf7e20
    }
`
:
styled(Text)``