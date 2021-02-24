import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    width: 100%;
    border: 1px solid #bfbfbf;
    color: #bfbfbf;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;

    @media(max-width:420px) {
        height: calc(var(--app-height) - 320px);
    }

    @media(min-width:421px) {
        height: calc(var(--app-height) - 265px);
    }
    

    &:hover {
        color: #0dbf7e;
        border: 1px solid #0dbf7e;
        background-color: #0dbf7e20;
    }
`
:
styled(TouchableOpacity)``