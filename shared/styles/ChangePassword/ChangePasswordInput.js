import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    display: block;
    width: 100%; 
    border-radius: 5px;
    color: #17242D;
    border: 2px solid ${props => props.error ? 'red': '#f2f2f2'};
    padding: .375rem .75rem;
    
    &:focus {
        color: #17242D;
        border: 2px solid ${props => props.error ? 'red': '#0dbf7e'};
        box-shadow: none;
        outline: 0;
    }
`
:
styled(TextInput)`
    width: 100%; 
    border-radius: 5px;
    color: #17242D;
    border: 2px solid ${props => props.error ? 'red': props.isFocused ? '#0dbf7e' : '#f2f2f2'};
    padding: 10px;
`