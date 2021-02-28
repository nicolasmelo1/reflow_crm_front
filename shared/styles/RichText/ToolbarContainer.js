import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding: 5px 10px;
    border: 1px solid #f2f2f2;
    border-radius: 4px;
    overflow: auto;
    width: 100%;
    background-color: white;
    display: flex;
    flex-direction: row;
    z-index: 10;
    align-items: center;
    box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 4px 3px;

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
`