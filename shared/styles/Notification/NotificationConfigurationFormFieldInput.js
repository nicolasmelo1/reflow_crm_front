import React from 'react'
import styled from 'styled-components'
import { Form } from 'react-bootstrap'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(Form.Control)`
    border: 0;
    background-color: white !important;
    color: #444;
    border: 1px solid #0dbf7e;

    &:focus {
        color: #444;
        background-color: white;
        border: 1px solid #444;
        box-shadow: none;
        outline: 0;
    }
`
:
styled(TextInput)`
    background-color: white !important;
    border-radius: 4px;
    padding: 5px;
    min-height: 30px;
    color: #444;
    border: 1px solid #0dbf7e;
`