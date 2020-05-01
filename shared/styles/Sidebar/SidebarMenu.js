import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'


export default process.env['APP'] === 'web' ?
styled(({sidebarIsOpen, ...rest}) => <nav {...rest}/>)`
    justify-content: center;
    background: #17242D;
    height: calc(100vh - 3.25rem);
    overflow-y: auto;
    text-align: auto;
    padding: 0 0 2rem 0;
    position: absolute;
    top: 0;
    transition: width 0.3s ease-in-out;
    box-shadow: 0 4px 20px 0 #17242D;

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
styled(({sidebarIsOpen, ...rest}) => <View {...rest}/>)`
    background-color: #17242D;
    text-align: auto;
    padding: 0 0 2px 0;
    align-self:stretch;
    height: 100%;
    width: 80%;
`
