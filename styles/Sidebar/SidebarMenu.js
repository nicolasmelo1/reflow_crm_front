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
    transition: width 0.3s ease-in-out;
    box-shadow: 0 4px 20px 0 #444444;

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
