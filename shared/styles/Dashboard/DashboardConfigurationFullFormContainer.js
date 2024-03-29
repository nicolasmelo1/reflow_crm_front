import React from 'react'
import styled from 'styled-components'
import { SafeAreaView } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: absolute;
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

    @media(min-width: 420px) {
        left: -60px;
    }
    @media(max-width: 420px) {
        left: 0;
    }
    
    @media(max-width: 740px) {
        overflow: auto;
    }
    @media(min-width: 740px) {
        overflow: hidden;
    }
`
:
styled(SafeAreaView)`
    padding: 10px;
`