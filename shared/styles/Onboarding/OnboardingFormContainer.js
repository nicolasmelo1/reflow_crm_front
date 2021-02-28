import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border-radius: 20px;
    padding: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    opacity: ${props => props.showForm ? '1': '0'};
    transition: opacity 1s ease-in-out; 
    max-height: calc(var(--app-height) - 30px);
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
styled(ScrollView)`
    border-radius: 20px;
    padding: 0 20px 0 20px;
    width: 100%;
    height: 95%;
    flex-direction: column;
`