import React from 'react'
import styled from 'styled-components'
import { Form } from 'react-bootstrap'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ?
styled(Form.Control)`
    min-width: 100px;
    border-radius: 0 !important;

    &:focus {
        color: #495057;
        background-color: #fff;
        border-color: #0dbf7e !important;
        box-shadow: 0 0 0 0.2rem #0dbf7e25 !important;
        outline: 0;
        box-shadow: none;
    }
`
:
styled(TextInput)`
    background-color: white !important;
    border-radius: 4px;
    padding: 5px;
    min-height: 30px;
    color: #17242D;
    border: 1px solid #0dbf7e;
`