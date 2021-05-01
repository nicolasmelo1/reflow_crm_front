import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Animated, View, Easing, Dimensions } from 'react-native'


export default process.env['APP'] === 'web' ?
styled(({sidebarIsOpen, ...rest}) => <nav {...rest}/>)`
    justify-content: center;
    background-color: #17242D;
    height: calc(var(--app-height) - var(--app-navbar-height));
    overflow-y: auto;
    text-align: auto;
    padding: 0 0 2rem 0;
    position: absolute;
    top: 0;
    transition: width 0.3s ease-in-out;
    box-shadow: 0 4px 20px 0 #17242D;

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
        z-index: 4;
    }

    @media(min-width: 420px) {
        z-index: 10;
    }

    @media(min-width: 320px) {
        width: ${({ sidebarIsOpen }) => sidebarIsOpen ? '310px' : '0'};
    }
    @media(max-width: 320px) {
        width: ${({ sidebarIsOpen }) => sidebarIsOpen ? '270px' : '0'};
    }
`
:
styled(({...rest}) => <View {...rest}/>)`
    background-color: #17242D;
    text-align: auto;
    padding: 0 0 2px 0;
    align-self:stretch;
    height: 100%;
    width: 80%;
`
