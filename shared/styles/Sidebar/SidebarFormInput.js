import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?
styled.input`
    background-color: transparent;
    border: 0px solid black;
    transition: all !important;
    border-bottom: 1px solid #0dbf7e;
    font-size: 15px;
    padding: 0px 5px 5px 5px; 
    color: #0dbf7e;
    margin: 5px 0;
    width: 100%;

    &:focus {
        color: #fff;
        background-color: transparent;
        border-bottom: 1px solid #0dbf7e;
        box-shadow: none;
        outline: 0;
      }
`
:
null
