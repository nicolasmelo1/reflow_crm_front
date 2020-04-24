import React from 'react'
import styled from 'styled-components'
import { Form } from 'react-bootstrap'

export default process.env['APP'] === 'web' ?
styled(Form.Control)`
    background-color: transparent;
    border: 0px solid black;
    transition: all !important;
    border-bottom: 2px solid #fff;
    color: #ffffff;
    font-weight: bold;
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