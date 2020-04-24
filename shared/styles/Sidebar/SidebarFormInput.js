import React from 'react'
import styled from 'styled-components'
import { Form } from 'react-bootstrap'

export default process.env['APP'] === 'web' ?
styled(Form.Control)`
    background-color: transparent;
    border: 0px solid black;
    transition: all !important;
    border-bottom: 1px solid #0dbf7e;
    font-size: 15px;
    padding: 0px 5px 5px 5px; 
    color: #0dbf7e;
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
