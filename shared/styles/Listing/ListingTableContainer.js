import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    text-align: center;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
    
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

    @media(max-width: 420px) {
        max-height: calc(var(--app-height) - var(--app-navbar-height) - ${props=> props.isMobile ? '210px' : '230px'});
    }
    @media(min-width: 420px) {
        max-height: calc(var(--app-height) - var(--app-navbar-height) - ${props=> props.isMobile ? '130px' : '150px'})
    }
`
:
styled(View)``