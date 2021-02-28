import React from 'react'
import styled from 'styled-components'
import { FlatList } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    color: black;
    padding: 10px;
    overflow-y: auto;

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
    
    @media(max-width: 492px) {
        max-height: calc(var(--app-height) - 207px)
    }

    @media(min-width: 492px) {
        max-height: calc(var(--app-height) - 47px)
    }
`
:
styled(FlatList)`
    height: 85%;
    width: 100%;
    padding: 10px;
`