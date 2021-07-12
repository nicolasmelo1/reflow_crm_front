import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(({sidebarIsOpen, ...rest}) => <button {...rest}/>)`
    transition: left 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-weight: bold;
    height: 2rem;
    border: none;
    cursor: pointer;
    color: #0dbf7e;
    z-index: 10;

    @media(min-width: 420px) {
        margin: 13px 0 10px 12px;
        background-color: #ffffff10;
        border-radius: 10px;
        left: ${({ sidebarIsOpen }) => sidebarIsOpen ? '295px' : '60px'};
    }
    
    @media(max-width: 420px) {
        top: var(--app-navbar-height);
        background-color: #17242D;
        position: fixed;
        border-radius: 0 20px 20px 0;
        left: ${({ sidebarIsOpen }) => sidebarIsOpen ? 'calc(var(--app-width) - 50px)' : '0'};
    }

    &:hover {
        background-color: #000;
    }
`
:
styled(({sidebarIsOpen, ...rest}) => <TouchableOpacity {...rest}/>)`
    background-color: #17242D;
    justify-content: center;
    border-bottom-right-radius: 20px;
    border-top-right-radius: 20px;
    height: 40px;
    width: 60px;
`