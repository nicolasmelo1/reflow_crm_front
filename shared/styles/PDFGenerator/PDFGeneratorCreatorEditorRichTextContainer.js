import React from 'react'
import styled from 'styled-components'
import { View, PixelRatio } from 'react-native'


export default process.env['APP'] === 'web' ?
styled.div`
    height: calc(var(--app-height) - 108px);
    box-shadow: #3c404315 0px 1px 3px 1px;
    padding: 70px;
    max-width: 764px;
    background-color: #fff;
    margin: auto;
    overflow: auto;

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
    height: ${props => {
        return props.height - (43 * PixelRatio.get())
    }
    }px
`