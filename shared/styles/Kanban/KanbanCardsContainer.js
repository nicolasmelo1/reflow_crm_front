import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    overflow-y: ${props => props.forceScroll ? 'scroll': 'auto'};
    
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
    
    &:after {
        content: "";
        display: block;
        height: 50px;
        width: 100%;
    }

    @media(max-width: 640px) {
        max-height: calc(100vh - 327px);
        min-height: calc(100vh - 327px)

    }
    @media(min-width: 640px) {
        max-height: calc(100vh - 254px);
        min-height: calc(100vh - 254px)
    }
`
:
styled(View)``