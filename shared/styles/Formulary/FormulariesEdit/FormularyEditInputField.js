import React from 'react'
import styled from 'styled-components'

export default styled.input`
    border: 0;
    background-color: white !important;
    color: #17242D;
    border: 1px solid ${props=> props.errors ? 'red': '#f2f2f2'};
    display: block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    background-clip: padding-box;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    
    &:focus {
        outline: none;
        border: 2px solid ${props => props.error ? 'red': '#0dbf7e'};
        box-shadow: none
    }
`