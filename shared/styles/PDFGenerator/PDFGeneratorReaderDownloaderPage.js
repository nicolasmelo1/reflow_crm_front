import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    box-shadow: #3c404315 0px 1px 3px 1px;
    height: calc(var(--app-height) - 52px);
    padding: 20px;
    width: 764px;
    background-color: #fff;
    margin: auto;
    overflow: auto;

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
styled(View)``