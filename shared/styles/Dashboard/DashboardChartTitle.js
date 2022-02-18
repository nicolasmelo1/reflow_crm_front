import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    text-align: center;
    position: absolute;
    width: 100%;
    color: #0dbf7e;
    white-space: nowrap;
    overscroll-behavior: none;

    scrollbar-color: #bfbfbf transparent;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 5px;
    }

    &::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 8px;
        height: 8px;
        background-color: transparent;
    }
`
:
styled(Text)`
    text-align: center;
    width: 100%;
    color: #0dbf7e;
    font-size: 24px;
`