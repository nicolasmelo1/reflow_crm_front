import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?
styled.input`
    background-color: transparent;
    border: 0px solid black;
    transition: all !important;
    border-bottom: 2px solid #fff;
    color: #ffffff;
    font-weight: bold;
    width: 100%;
    padding: 5px 10px;
    margin: 10px 0;

    &:focus {
        color: #0dbf7e;
        background-color: transparent;
        border-bottom: 2px solid #fff;
        box-shadow: none;
        outline: 0;
      }
`
:
null