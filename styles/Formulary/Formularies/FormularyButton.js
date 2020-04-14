import React from 'react'
import styled from 'styled-components'
import { Button } from 'react-bootstrap'

export default styled(React.forwardRef(({isOpen, ...rest}, ref) => <Button {...rest} ref={ref}/>))`
    color: white; 
    border: 0; 
    border-radius: 10px 10px 0 0;
    text-align: center; 
    background-color:#0dbf7e; 
    padding: 10px 40px; 
    position: absolute;
    text-overflow: ellipsis;
    white-space: nowrap;
    right: 0;
    font-size: 20px; 

    ${props => props.isOpen ? 'box-shadow: -5px 5px 20px #444;' : ''}

    &:hover {
        background-color:#444; 
    }
    &:active {
        background-color:#444 !important; 
    }

    @media(max-width: 420px) {
        width: 100%;
        top: ${props => props.isOpen ? '-50px' : '-75px'};
    }

    @media(min-width: 420px) {
        margin-right: 15px;
        top: -50px;
    }
`