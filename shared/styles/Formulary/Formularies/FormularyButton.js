import React from 'react'
import styled from 'styled-components'

export default styled(React.forwardRef(({isOpen, ...rest}, ref) => <button {...rest} ref={ref}/>))`
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
    top: -50px;

    ${props => props.isOpen ? 'box-shadow: -5px 5px 20px #17242D;' : ''}

    &:hover {
        background-color:#17242D; 
    }
    &:active {
        background-color:#17242D !important; 
    }

    @media(max-width: 420px) {
        width: 100%;
    }

    @media(min-width: 420px) {
        margin-right: 15px;
    }
`