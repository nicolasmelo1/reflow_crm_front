import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    padding: 10px;
    border-width: 0;
    border-radius: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 1px solid #444;
    color: ${props => props.isSelected ? "#0dbf7e" : "#fff"};
    font-weight: ${props => props.isSelected ? "bold" : "normal"};
    width: 100%;
    padding: 10px;
    ${props => props.sidebarIsOpen ? `
        display: flex;
        flex-direction: row;
        align-items: center;
    ` : ''}
`
:
null