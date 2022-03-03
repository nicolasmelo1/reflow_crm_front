import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Animated, View, Easing, Dimensions } from 'react-native'


export default process.env['APP'] === 'web' ?
styled(({sidebarIsOpen, ...rest}) => <nav {...rest}/>)`
    background-color: #20253F;
    height: var(--app-height);
    overflow-y: auto;
    text-align: auto;
    padding: 0 0 2rem 0;
    position: absolute;
    border-radius: 0 15px 15px 0;
    top: 0;
    transition: width 0.3s ease-in-out, z-index 0.3s ease-in-out;

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
        ${props => props.sidebarIsOpen ? 'z-index: 4;' : ''};
    }

    @media(min-width: 420px) {
        z-index: 10;
    }

    @media(min-width: 420px) {
        width: ${({ sidebarIsOpen }) => sidebarIsOpen ? '295px' : '60px'};
    }
    @media(max-width: 420px) {
        width: ${({ sidebarIsOpen }) => sidebarIsOpen ? 'calc(var(--app-width) - 50px)' : '0'};
    }
`
:
styled(({...rest}) => <View {...rest}/>)`
    background-color: #20253F;
    text-align: auto;
    padding: 0 0 2px 0;
    align-self:stretch;
    height: 100%;
    width: 80%;
`
