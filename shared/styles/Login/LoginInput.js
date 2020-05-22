import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    display: block;
    width: 100%; 
    border-radius: 5px;
    color: #17242D;
    border: 1px solid ${props => props.error ? 'red': '#17242D'};
    padding: .375rem .75rem;
    
    &:focus {
        color: #17242D;
        border: 1px solid #0dbf7e;
        box-shadow: none;
        outline: 0;
    };
`
:
styled(TextInput)`
    width: ${props => props.isPassword ? '80%' : '100%'}; 
    border-radius: 5px;
    color: #17242D;
    border: 1px solid ${props => props.error ? 'red': props.isFocused ? '#0dbf7e' : '#17242D'};
    padding: 10px;
    background-color: #fff;
`