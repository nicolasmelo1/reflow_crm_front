import React from 'react'
import styled from 'styled-components'
import { Form } from 'react-bootstrap'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(Form.Control)`
    border: 0;
    background-color: white !important;
    color: #444;
    border: 1px solid ${props=> props.errors ? 'red': '#0dbf7e'};
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