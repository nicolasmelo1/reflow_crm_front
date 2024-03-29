import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow-y: auto;

    @media(min-width: 740px) {
        flex-direction: row;
        justify-content: flex-start;
        height: calc(var(--app-height) - var(--app-navbar-height) - 117px);
    }

    @media(max-width: 641px) {
        justify-content: center;
        align-items: center;
        height: calc(var(--app-height) - var(--app-navbar-height) - 167px);
    };

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
styled(View)`
    height: 100%;
    align-items: center;
`