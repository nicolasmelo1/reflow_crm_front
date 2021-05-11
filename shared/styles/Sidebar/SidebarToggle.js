import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(({sidebarIsOpen, ...rest}) => <button {...rest}/>)`
    position: absolute;
    transition: left 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-weight: bold;
    height: 2rem;
    background: #17242D;
    border-radius: 0 20px 20px 0;
    border: none;
    cursor: pointer;
    color: #0dbf7e;

    @media(max-width: 420px) {
        z-index: 4;
    }

    @media(min-width: 420px) {
        z-index: 10;
    }

    @media(min-width: 420px) {
        left: ${({ sidebarIsOpen }) => sidebarIsOpen ? '295px' : '60px'};
    }
    @media(max-width: 420px) {
        left: ${({ sidebarIsOpen }) => sidebarIsOpen ? 'calc(var(--app-width) - 40px)' : '0'};
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