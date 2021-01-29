import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    font-size: 1.75rem;
    color: ${props => props.isValid ? '#0dbf7e' : 'red'};
    border-right: 0;
    border-top: 0;
    border-left: 0;
    border-bottom: ${props => props.isValid ? '0' : '1px solid red'};
    background-color: transparent;
    margin-bottom: 5px;
    width: 100%;
    
    &:focus {
        outline: none;
    }
`
:
styled(TextInput)`
    color: #0dbf7e;
    border-bottom-color: #0dbf7e;
    border-bottom-width: 1px; 
    max-width: 93%
`