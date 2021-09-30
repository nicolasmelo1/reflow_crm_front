import React from 'react'
import styled from 'styled-components'
import { View, TouchableOpacity } from 'react-native'

export const AppButton = process.env['APP'] === 'web' ? 
styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #0dbf7e;
    color: #0dbf7e;
    width: 100px;
    height: 100px;
    background-color: transparent;
    border-radius: 20px;
` 
: 
styled(TouchableOpacity)`
`

export const AutomationCreationModal = process.env['APP'] === 'web' ? 
styled.div`
    position: absolute;
    left: 0;
    padding: ${props => props.isOpen ? '0 10px' : '0' };
    bottom: ${props => props.isOpen ? '0' : 'calc(0px - var(--app-height))' };
    height: var(--app-height);
    width: var(--app-width);
    background-color: #fff;
    transition: bottom 0.3s ease-in-out, padding 0.3s ease-in-out;
    z-index: 20;

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
styled(View)``