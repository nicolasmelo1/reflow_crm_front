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

    @media(min-width: 640px) {
        flex-direction: row;
        justify-content: flex-start;
        height: calc(var(--app-height) - 180px);
    }

    @media(max-width: 640px) {
        justify-content: center;
        align-items: center;
        height: calc(var(--app-height) - 240px);
    };

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