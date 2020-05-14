import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    display: block;
    width: 100%; 
    margin-bottom: 15px;
    border-radius: 5px;
    color: #17242D;
    border: 1px solid #17242D;
    padding: .375rem .75rem;
    
    &:focus {
        color: #17242D;
        border: 1px solid #0dbf7e;
        box-shadow: none;
        outline: 0;
    }
`
:
styled(TextInput)`
    width: 100%;
    padding: 5px;
    border: 1px solid #17242D;
    border-radius: 5px;
`