import { push as Menu } from 'react-burger-menu'
import React from 'react'
import styled from 'styled-components'


export default styled(({sidebarIsOpen, ...rest}) => <nav {...rest}/>)`
    justify-content: center;
    background: #444;
    height: calc(100vh - 3.25rem);
    overflow-y: auto;
    text-align: auto;
    padding: 0 0 2rem 0;
    position: absolute;
    top: 0;
    z-index: 10;
    transition: width 0.3s ease-in-out;
    box-shadow: 0 4px 20px 0 #444444;
    width: ${({ sidebarIsOpen }) => sidebarIsOpen ? '310px' : '0'};
`
