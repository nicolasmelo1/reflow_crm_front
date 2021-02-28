import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    text-align: center;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
    
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
        max-height: calc(var(--app-height) - ${props=> props.isMobile ? '285px' : '305px'});
    }
    @media(min-width: 420px) {
        max-height: calc(var(--app-height) - ${props=> props.isMobile ? '195px' : '215px'})
    }
`
:
styled(View)``