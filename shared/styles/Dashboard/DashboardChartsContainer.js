import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding-bottom: 50px;
    overflow: auto;
    position: relative;
    width: calc(var(--app-width) - 40px);

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

    @media(min-width: 640px) {
        height: calc(var(--app-height) - 180px);
    }

    @media(max-width: 640px) {
        height: calc(var(--app-height) - 200px);
    }
    `
:
styled(View)`
    height: 98%;
    padding: 0 10px;
`