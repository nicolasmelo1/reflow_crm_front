import React from 'react'
import styled from 'styled-components'
import { Button } from 'react-native'

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

    @media(min-width: 320px) {
        left: ${({ sidebarIsOpen }) => sidebarIsOpen ? '310px' : '0'};
    }
    @media(max-width: 320px) {
        left: ${({ sidebarIsOpen }) => sidebarIsOpen ? '270px' : '0'};
    }
`
:
styled(({sidebarIsOpen, ...rest}) => <Button color="#0dbf7e" {...rest}/>)`
    font-weight: bold;
    margin-left: 90px;
    height: 20px;
    left: 20px;
`