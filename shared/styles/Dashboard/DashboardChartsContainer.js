import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 50px;
    overflow: auto;
    position: relative;
    width: 100%;

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

    @media(min-width: 740px) {
        height: calc(var(--app-height) - var(--app-navbar-height) - 130px);
    }

    @media(max-width: 740px) {
        height: calc(var(--app-height) - var(--app-navbar-height) - 207px);
    }
    `
:
styled(View)`
    height: 98%;
    padding: 0 10px;
`