import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`

    @media(max-width: 900px) {
        overflow-y: scroll;
        max-height: calc(var(--app-height) - 60px)
    }
    @media(min-width: 900px) {
        display: flex;
        flex-direction: row;
    }

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
styled(ScrollView)`
    padding: 0 10px;
`