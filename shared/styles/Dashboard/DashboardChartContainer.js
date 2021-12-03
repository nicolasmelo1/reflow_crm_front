import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding-bottom: 20px;
    margin-bottom: 20px;
    overflow: auto; 
    overscroll-behavior: none;
    
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
    
    &:last-child {
        margin-bottom: 110px
    }

    &:not(:last-child) {
        border-bottom: 1px solid #bfbfbf
    }
`
:
styled(View)`
    height: 500px;
    padding: 10px 0;
    border-bottom-width: 1px;
    border-bottom-color: #20253F;
`